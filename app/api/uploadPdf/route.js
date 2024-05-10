import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();
const supabaseUrl = "https://inyhkgnpatnukqwcqwjr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlueWhrZ25wYXRudWtxd2Nxd2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzNTE4NzcsImV4cCI6MjAyODkyNzg3N30.aPE4oEg-I62l1WODiymFiPLUIM9DmRP3RzuyQXz79Ws";
const supabase = createClient(supabaseUrl, supabaseKey);
export async function POST(req) {
  const formData = await req.formData();

  // console.log(formData);
  // const image = formData.get("image");
  const pdf = formData?.get("pdf");
  const uniqueId = formData?.get("id");
  // console.log(pdf);
  //   const excel = formData.get("excel");
  //   const uniqueId = formData.get("id");
  if (!pdf) {
    return NextResponse.json(
      { error: "No PDF file provided." },
      { status: 400 }
    );
  }

  let pdfUrl;

  if (pdf) {
    const timestamp = new Date().getTime();
    const pdfName = `${timestamp}-${pdf.name}`;
    const contentType = pdf.type;
    try {
      const { data, error } = await supabase.storage
        .from("reports")
        .upload(`pdfDetail/${pdfName}`, pdf, { contentType: contentType });
      if (error) {
        console.log(
          "First Failed to upload PDF file to Supabase storage.",
          error
        );
        return NextResponse.json(
          { error: "Failed to upload PDF file to Supabase storage." },
          { status: 500 }
        );
      }
      console.log(data);
      pdfUrl = `${supabaseUrl}/storage/v1/object/public/${data.fullPath}`;
    } catch (error) {
      console.log("supabase storage cannot proper work in pdf", error);
    }
  }
  try {
    // Save to database
    if (prisma.pdf && prisma.pdf.create) {
      const result = await prisma.pdf.create({
        data: {
          id: uniqueId,
          pdf: pdfUrl,
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
