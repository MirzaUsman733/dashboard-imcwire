import { PrismaClient } from "@prisma/client";
import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
// import _, { uniqueId } from "lodash";

const prisma = new PrismaClient();
export async function POST(req) {
  const formData = await req?.formData();
  // const image = formData.get("image");
  const pdf = formData?.get("pdf");
  const excel = formData?.get("excel");
  const uniqueId = formData?.get("id");
  if (!pdf && !excel) {
    return NextResponse.json(
      { error: "No PDF, or Excel file provided." },
      { status: 400 }
    );
  }

  let //  imageUrl,
    pdfUrl,
    excelUrl;

  // if (image) {
  //   const imageBuffer = Buffer.from(await image.arrayBuffer());
  //   const imageUploadDir = join(
  //     "public",
  //     `/uploads/images/${getDatePath()}`
  //   );
  //   imageUrl = await saveFile(imageBuffer, image, imageUploadDir);
  // }

  if (pdf) {
    const fileBuffer = Buffer.from(await pdf?.arrayBuffer());
    const fileUploadDir = join("assets", `/uploads/pdf`);
    pdfUrl = await saveFile(fileBuffer, pdf, fileUploadDir);
  }
  if (excel) {
    const excelBuffer = Buffer.from(await excel.arrayBuffer());
    const excelUploadDir = join("assets", `/uploads/excel`);
    excelUrl = await saveFile(excelBuffer, excel, excelUploadDir);
  }
  try {
    // Save to database
    if (prisma?.file && prisma?.file?.create) {
      const result = await prisma?.file?.create({
        data: {
          id: uniqueId,
          // image: imageUrl,
          pdf: pdfUrl,
          excel: excelUrl,
        },
      });

      return NextResponse.json({ file: result });
    } else {
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

async function saveFile(buffer, pdf, uploadDir) {
  try {
    await stat(uploadDir);
  } catch (e) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      throw e;
    }
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${pdf.name.replace(/\.[^/.]+$/, "")}.${mime.getExtension(
      pdf.type
    )}`;
    await writeFile(`${uploadDir}/${filename}`, buffer);
    return `${uploadDir}/${filename}`;
  } catch (e) {
    throw e;
  }
}

function getDatePath() {
  return new Date(Date.now())
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
}

export async function PUT(req) {
  try {
    const data = await req?.json();
    const url = new URL(req?.url);
    const id = url?.searchParams?.get("_id");
    const { ...updatedData } = data;
    await prisma?.file?.update({
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
      const publications = await prisma?.file?.findUnique({
        where: { id: id },
      });
      return NextResponse.json(publications);
    } else {
      const publications = await prisma?.file?.findMany();
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
      await prisma?.file?.delete({ where: { id: Number(id) } });
    }
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
