import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req?.json();
    console.log(data)
    const isAdmin = true;
    if (isAdmin) {
      const planDoc = await prisma?.report?.create({ data });
      console.log("Plan docs",planDoc)
      return NextResponse.json(planDoc);
    } else {
      return NextResponse.json({});
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const url = new URL(req?.url);
    const id = url?.searchParams?.get("_id");
    const { ...updatedData } = data;
    await prisma?.report?.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

export async function GET(req) {
  try {
    const url = new URL(req?.url);
    const id = url?.searchParams?.get("_id");
    if (id) {
      const Reports = await prisma?.report?.findUnique({
        where: { id: parseInt(id) },
      });
      return NextResponse.json(Reports);
    } else {
      const Reports = await prisma?.report?.findMany();
      return NextResponse.json(Reports);
    }
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
    const id = url?.searchParams?.get("id");
    const isAdmin = true;
    if (isAdmin) {
      await prisma?.report?.delete({ where: { id: Number(id) } });
    }
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
