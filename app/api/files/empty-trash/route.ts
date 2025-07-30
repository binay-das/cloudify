import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trashedFiles = await prisma.file.findMany({
      where: {
        userId,
        isTrash: true
      }
    });

    if (trashedFiles.length === 0) {
      return NextResponse.json({ message: "No files in trash" }, { status: 200 });
    }

    const filesToDelete = trashedFiles.filter((file) => !file.isFolder).map(async (file) => {
        try {
          let imagekitFileId = null;

          if (file.fileUrl) {
            const urlWithoutQuery = file.fileUrl.split("?")[0];
            imagekitFileId = urlWithoutQuery.split("/").pop();
          }

          if (!imagekitFileId && file.path) {
            imagekitFileId = file.path.split("/").pop();
          }

          if (imagekitFileId) {
            try {
              const searchResults = await imagekit.listFiles({
                name: imagekitFileId,
                limit: 1,
              });

              if (searchResults && searchResults.length > 0) {
                await imagekit.deleteFile(searchResults[0].fileId);
              } else {
                await imagekit.deleteFile(imagekitFileId);
              }
            } catch (searchError) {
              console.error(
                `Error searching for file in ImageKit:`,
                searchError
              );
              await imagekit.deleteFile(imagekitFileId);
            }
          }
        } catch (error) {
          console.error(`Error deleting file ${file.id} from ImageKit:`, error);
        }
      });

    await Promise.allSettled(filesToDelete);

    const deletedFiles = await prisma.file.deleteMany({
      where: {
        userId,
        isTrash: true
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedFiles.count} files from trash`,
    });
  } catch (error) {
    console.error("Error emptying trash:", error);
    return NextResponse.json(
      { error: "Failed to empty trash" },
      { status: 500 }
    );
  }
}