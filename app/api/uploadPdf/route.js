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
      host: process.env.FTP_host,
      user: process.env.FTP_user,
      password: process.env.FTP_password,
      secure: false,
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
    const formData = await req.formData();
    const url = new URL(req.url);
    const id = url.searchParams.get("_id");
    const pdfFile = formData.get("pdf");

    // Validate the ID
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid ID provided" },
        { status: 400 }
      );
    }

    // Validate the PDF file
    if (!pdfFile) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    // Step 2: Retrieve the current PDF record from the database
    const currentPdfRecord = await prisma.pdf.findUnique({
      where: { id: id },
    });

    if (!currentPdfRecord) {
      return NextResponse.json(
        { error: "PDF record not found." },
        { status: 404 }
      );
    }

    const currentPdfPath = currentPdfRecord.pdf;
    const currentPdfFileName = currentPdfPath.split("/").pop();

    // Step 3: Delete the old PDF file from the FTP server
    const client = new Client();
    client.ftp.verbose = true;
    try {
      await client.access({
        host: process.env.FTP_host,
        user: process.env.FTP_user,
        password: process.env.FTP_password,
        secure: false,
        secureOptions: { rejectUnauthorized: false },
      });
      const filePartAfterUnderscore = currentPdfFileName.split("_")[1];

      const pdfFirstChar = filePartAfterUnderscore[0].toLowerCase();

      await client.cd(`/uploads/pdf-Data/${pdfFirstChar}`);
      // Delete the old file from FTP
      await client.remove(
        `/uploads/pdf-Data/${pdfFirstChar}/${currentPdfFileName}`
      );
    } catch (ftpError) {
      console.error("Error deleting old PDF from FTP:", ftpError);
    } finally {
      client.close();
    }

    // Step 4: Save the new PDF file locally and upload it to FTP
    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const sanitizedPdfName = pdfFile.name.replace(/ /g, "-");
    const pdfPath = path.join(tempDir, sanitizedPdfName);
    await pipeline(pdfFile.stream(), fs.createWriteStream(pdfPath));

    const pdfFirstChar = sanitizedPdfName[0].toLowerCase();

    const uploadClient = new Client();
    uploadClient.ftp.verbose = true;
    try {
      await uploadClient.access({
        host: process.env.FTP_host,
        user: process.env.FTP_user,
        password: process.env.FTP_password,
        secure: false,
        secureOptions: { rejectUnauthorized: false },
      });

      await uploadClient.cd(`/uploads/pdf-Data/${pdfFirstChar}`);
      await uploadClient.uploadFrom(
        pdfPath,
        `/uploads/pdf-Data/${pdfFirstChar}/${id}_${sanitizedPdfName}`
      );
    } catch (uploadError) {
      console.error("Error uploading new PDF to FTP:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload new PDF." },
        { status: 500 }
      );
    } finally {
      uploadClient.close();
      fs.unlinkSync(pdfPath); // Clean up the temporary file
    }

    // Step 5: Update the database with the new PDF path
    const result = await prisma.pdf.update({
      where: { id: id },
      data: {
        pdf: `/uploads/pdf-Data/${pdfFirstChar}/${id}_${sanitizedPdfName}`,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error during update operation:", error);
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
