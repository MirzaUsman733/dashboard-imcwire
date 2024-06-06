import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();
    const isAdmin = true;

    if (isAdmin) {
      const company = await prisma?.company?.create({
        data: data,
      });

      return NextResponse.json(company);
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
    const { id, ...updatedData } = data;

    await prisma.company.update({
      where: { id },
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
    console.log(id)
    if (id) {
      const company = await prisma?.company?.findUnique({
        where: { id: parseInt(id) },
      });
      return NextResponse.json(company);
    } else {
      const companies = await prisma?.company?.findMany();
      return NextResponse.json(companies);
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
    const { id } = await req?.json(); // await the resolution of req.json() promise
    await prisma?.company?.delete({
      where: { id },
    });

    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
