import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGE_KIT_URL_END_POINT || "",
});

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId } = await props.params;

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }

    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
        userId
      }
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (!file.isFolder) {
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
              const result = searchResults[0];
              if ('fileId' in result) {
                await imagekit.deleteFile(result.fileId);
              }
            } else {
              await imagekit.deleteFile(imagekitFileId);
            }
          } catch (searchError) {
            console.error(`Error searching for file in ImageKit:`, searchError);
            await imagekit.deleteFile(imagekitFileId);
          }
        }
      } catch (error) {
        console.error(`Error deleting file ${fileId} from ImageKit:`, error);
      }
    }

    const deletedFile = await prisma.file.delete({
      where: {
        id: fileId,
        userId
      }
    });

    return NextResponse.json({ success: true, message: "File deleted successfully", deletedFile });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}