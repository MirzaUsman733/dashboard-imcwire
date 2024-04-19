import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        await prisma?.$connect();
        const userData = await prisma?.user?.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });
        await prisma?.$disconnect();
        return NextResponse.json({ userData });
    } catch (error) {
        return NextResponse.error({ status: 500, message: 'Internal Server Error' });
    }
}
