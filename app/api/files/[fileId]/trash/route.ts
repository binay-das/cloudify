import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
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

        const updatedFile = await prisma.file.update({
            where: {
                id: fileId,
                userId
            },
            data: {
                isTrash: !file.isTrash
            }
        });

        const action = updatedFile.isTrash ? "moved to trash" : "restored";
        return NextResponse.json({ ...updatedFile, message: `File ${action} successfully` });
    } catch (error) {
        console.error("Error updating trash status:", error);
        return NextResponse.json({ error: "Failed to update file trash status" }, { status: 500 });
    }
}