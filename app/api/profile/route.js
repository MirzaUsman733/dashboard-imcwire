import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request) => {
  const data = await request?.json();
  console.log(data);
  try {
    await prisma.$connect();

    // Check if the user already exists
    const existingUser = await prisma?.userInfo?.findUnique({
      where: { email },
    });
    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 400 });
    }

    await prisma?.userInfo?.create({ data });

    await prisma.$disconnect();

    return new NextResponse("User is registered.", {
      status: 200,
    });
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export async function PUT(req) {
  try {
    const data = await req?.json();
    const url = new URL(req?.url);
    const id = url?.searchParams?.get("_id");
    const isAdmin = true;

    if (isAdmin) {
      const { ...updatedData } = data;

      const user = await prisma?.userInfo?.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        throw new Error("User not found");
      }

      await prisma?.userInfo?.update({
        where: { id: parseInt(id) },
        data: updatedData,
      });
    }

    return NextResponse?.json(true);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse?.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export async function GET() {
  try {
    const planItems = await prisma?.userInfo?.findMany();
    return NextResponse.json(planItems);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req?.url);
    const id = url?.searchParams?.get("_id");
    const isAdmin = true;
    if (isAdmin) {
      await prisma.userInfo.delete({
        where: { id: parseInt(id) },
      });
    }
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
