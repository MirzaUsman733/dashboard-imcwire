import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
const prisma = new PrismaClient();
const transporter = nodemailer?.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "Orders@imcwire.com",
    pass: "Sales@$$1aShahG!!boy,s",
  },
});
export async function POST(req) {
  try {
    const data = await req?.json();
    const isAdmin = true;
    if (isAdmin) {
      const planDoc = await prisma?.compaignData?.create({ data });
      const mailOptions = {
        from: "Orders@imcwire.com",
        to: "admin@imcwire.com",
        subject: "Press-Release Order",
        text: `Dear Admin ,\n\n New Order Placed by the client check it in the account .\n\nRegards,\nThe Admin`,
      };
      await transporter?.sendMail(mailOptions);
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
    const { ...data } = await req?.json();
    const url = new URL(req?.url);
    const id = url.searchParams.get("_id");
    const isAdmin = true;
    if (isAdmin) {
      await prisma?.compaignData?.update({
        where: { id: parseInt(id) },
        data: { ...data },
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

export async function GET(req) {
  try {
    const url = new URL(req?.url);
    const id = url?.searchParams?.get("_id");
    if (id) {
      const compaignData = await prisma?.compaignData?.findUnique({
        where: { id: Number(id) },
      });
      return NextResponse.json(compaignData);
    }
    const allCompaignData = await prisma?.compaignData?.findMany();
    return NextResponse.json(allCompaignData);
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
      await prisma?.compaignData?.delete({ where: { id: Number(id) } });
    }
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
