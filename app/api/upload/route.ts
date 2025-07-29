import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGE_KIT_URL_END_POINT!,
});

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("User ID:", userId);


        const formData = await request.formData();
        const file = formData.get("file") as File;
        const parentId = formData.get("parentId") as string | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const imagekitResponse = await imagekit.upload({
            file: buffer,
            fileName: `${uuidv4()}-${file.name}`,
            folder: `/droply/${userId}`,
        });

        const newFile = await prisma.file.create({
            data: {
                name: file.name,
                path: imagekitResponse.filePath,
                type: file.type || "image",

                fileUrl: imagekitResponse.url,
                thumbnailUrl: imagekitResponse.thumbnailUrl ?? null,

                userId,
                parentId: parentId || null,

                isFolder: false,
                isFav: false,
                isTrash: false,
            },
        });

        return NextResponse.json(newFile);
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
