import { NextResponse } from "next/server";
import { Client } from "basic-ftp";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { pipeline } from "stream/promises";
import path from "path";

const prisma = new PrismaClient();
export async function POST(req) {
  const formData = await req.formData();

  const uniqueId = formData?.get("id");
  const pdfFile = formData?.get("pdf");
  console.log(uniqueId)
  console.log(pdfFile)
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  if (!pdfFile) {
    return NextResponse.json(
      { error: "No PDF file provided." },
      { status: 400 }
    );
  }
  const sanitizedPdfName = pdfFile.name.replace(/ /g, "-");
  const pdfPath = path.join(tempDir, sanitizedPdfName);
  await pipeline(pdfFile.stream(), fs.createWriteStream(pdfPath));
  const pdfFirstChar = sanitizedPdfName[0].toLowerCase();

  const client = new Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: "185.224.133.237",
      user: "imcwire_ftp_user",
      password: "pzEl202cJdj7",
      secure: true,
      secureOptions: { rejectUnauthorized: false },
    });

    await client.cd(`/uploads/pdf-Data/${pdfFirstChar}`);
    await client.uploadFrom(
      pdfPath,
      `/uploads/pdf-Data/${pdfFirstChar}/${uniqueId}_${sanitizedPdfName}`
    );

    const result = await prisma.pdf.create({
      data: {
        id: uniqueId,
        pdf: `/uploads/pdf-Data/${pdfFirstChar}/${uniqueId}_${sanitizedPdfName}`,
      },
    });

    console.log("Database Record Result:", result);
    return NextResponse.json(result);
  } catch (e) {
    console.error("Error during file upload or database operation:", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  } finally {
    client.close();
    fs.unlinkSync(pdfPath);
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const url = new URL(req.url);
    const id = url.searchParams.get("_id");
    const { ...updatedData } = data;
    await prisma.pdf.update({
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
    const url = new URL(req.url);
    const id = url.searchParams.get("_id");
    if (id) {
      const publications = await prisma.pdf.findUnique({
        where: { id: id },
      });
      return NextResponse.json(publications);
    } else {
      const publications = await prisma.pdf.findMany();
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
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const isAdmin = true;
    if (isAdmin) {
      await prisma.pdf.delete({ where: { id: Number(id) } });
    }
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
