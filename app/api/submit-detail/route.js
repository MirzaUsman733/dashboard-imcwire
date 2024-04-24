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
    const file = data?.file;
    const isAdmin = true;
    if (isAdmin) {
      if (!file) {
        NextResponse.json({ error: "No file provided." }, { status: 400 });
      }
      let pdfUrl;
      if (pdfUrl) {
        const fileBuffer = Buffer.from(await file?.arrayBuffer());
        const fileUploadDir = join(
          "public",
          `/uploads/pdf/submit-detail/${getDatePath()}`
        );
        pdfUrl = await saveFile(fileBuffer, file, fileUploadDir);
      }

      const planDoc = await prisma?.publication?.create({ data, pdfUrl });
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
    const data = await req?.json();
    const url = new URL(req?.url);
    const id = url?.searchParams?.get("_id");
    const { ...updatedData } = data;
    const publicationId = parseInt(id);
    const user = await prisma?.publication?.findUnique({
      where: { id: parseInt(id) },
    });
    await prisma?.publication?.update({
      where: { id: publicationId },
      data: updatedData,
    });
    const userEmail = user?.storeData?.formDataSignUp?.email;
    const userName = user?.storeData?.formDataSignUp?.name;
    let emailSubject, emailText;
    // Determine email subject and text based on updatedData.action
    switch (updatedData?.storeData?.action) {
      case "pending":
        emailSubject = "Pending Press-Release Order";
        emailText = `Dear ${userName},\n\nYour order is pending for some reason.`;
        break;
      case "inprogress":
        emailSubject = "In Progress Press-Release Order";
        emailText = `Dear ${userName},\n\nYour order is in progress now.`;
        break;
      case "completed":
        emailSubject = "Completed Press-Release Order";
        emailText = `Dear ${userName},\n\nYour order is completed now.`;
        break;
        case "approved":
          emailSubject = "Your Provided Detail is Approved";
          emailText = "Your Provided Detail is Approved"
      default:
        emailSubject = "Updated Press-Release Order";
        emailText = `Dear ${userName},\n\nYour order is updated now with action: ${updatedData?.storeData?.action}.`;
    }

    const mailOptions = {
      from: "Orders@imcwire.com",
      to: userEmail,
      subject: emailSubject,
      text: emailText,
    };
    
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
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
      const publications = await prisma?.publication?.findUnique({
        where: { id: parseInt(id) },
      });
      return NextResponse.json(publications);
    } else {
      const publications = await prisma?.publication?.findMany();
      return NextResponse.json(publications);
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
      await prisma?.publication?.delete({ where: { id: Number(id) } });
    }
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
