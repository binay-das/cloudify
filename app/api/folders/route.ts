import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, parentId = null } = await req.json();

        if (!name || typeof name !== "string" || name.trim() === "") {
            return NextResponse.json({ error: "Invalid folder name" }, { status: 400 });
        }

        const existing = await prisma.file.findFirst({
            where: {
                name: name.trim(),
                userId,
                parentId,
                isFolder: true
            }
        });
        if (existing) {
            return NextResponse.json(
                { error: "A folder with this name already exists in this location" },
                { status: 400 }
            );
        }

        if (parentId) {
            const parentFolder = await prisma.file.findUnique({
                where: {
                    id: parentId,
                    userId,
                    isFolder: true
                }
            });

            if (!parentFolder) {
                return NextResponse.json(
                    { error: "Parent folder not found" },
                    { status: 404 }
                );
            }
        }

        const newFolder = await prisma.file.create({
            data: {
                name: name.trim(),
                path: `/folders/${userId}/${uuidv4()}`,
                type: "folder",
                fileUrl: "",
                isFolder: true,
                userId,
                parentId
            }
        });

        return NextResponse.json(newFolder);

    } catch (error) {
        console.error("Error creating folder:", error);
        return NextResponse.json(
            { error: "Failed to create folder" },
            { status: 500 }
        );
    }
}