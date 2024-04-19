import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET() {
  try {
    const planItems = await prisma?.loginLog?.findMany();
    return NextResponse.json(planItems);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
