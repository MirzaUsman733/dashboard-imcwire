import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req?.json();
    const isAdmin = true;

    if (isAdmin) {
      const planDoc = await prisma?.coupon?.create({
        data,
      });
      return NextResponse?.json(planDoc);
    } else {
      return NextResponse?.json({});
    }
  } catch (error) {
    return NextResponse?.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const isAdmin = true;

    if (isAdmin) {
      const { id, ...updatedData } = data;

      await prisma?.coupon?.update({
        where: { id },
        data: updatedData,
      });
    }

    return NextResponse?.json(true);
  } catch (error) {
    return NextResponse?.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

export async function GET() {
  try {
    const coupons = await prisma?.coupon?.findMany();
    return NextResponse.json(coupons);
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
      await prisma?.coupon?.delete({
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
