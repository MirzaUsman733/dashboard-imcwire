import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request) => {
  const data = await request?.json();
console.log(data)
  try {
    await prisma.$connect();

    // Check if the user already exists
    const existingUser = await prisma?.userInfo?.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 400 });
    }


    // Create a new user
    await prisma?.userInfo?.create({data});

    // const mailOptions = {
    //   from: "Orders@imcwire.com",
    //   to: email,
    //   subject: "Welcome to IMCWire",
    //   text: `Dear + ${name} + ,\n\nThank you for registering on our platform. Your account is pending approval by the admin. You will receive another email once your account is approved.\n\nRegards,\nThe Admin`,
    // };
   
    await prisma.$disconnect();

    return new NextResponse("User is registered.", {
      status: 200,
    });
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// export async function PUT(req) {
//   try {
//     const data = await req.json();
//     const url = new URL(req.url);
//     const id = url.searchParams.get("_id");
//     const isAdmin = true;

//     if (isAdmin) {
//       const { ...updatedData } = data;
//       await prisma.user.update({
//         where: { id: parseInt(id) },
//         data: updatedData,
//       });
//       const user = await prisma.user.findUnique({
//         where: { id: parseInt(id) },
//       });
//       const userEmail = user.email;
//       const userName = user.name;
//       const mailOptions = {
//         from: "Orders@imcwire.com",
//         to: userEmail,
//         subject: "Press-Release Order",
//         text: `Dear + ${userName} + ,\n\nYour Status is updated now your status is ${updatedData.status} Becuase of any reason`,
//       };
//       await transporter.sendMail(mailOptions);
//     }

//     return NextResponse.json(true);
//   } catch (error) {
//     return NextResponse.json({
//       status: 500,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// }

export async function PUT(req) {
  try {
    const data = await req?.json();
    const url = new URL(req?.url);
    const id = url?.searchParams?.get("_id");
    const isAdmin = true; // Assuming you have proper admin authentication

    if (isAdmin) {
      const { ...updatedData } = data;

      // Assuming prisma and transporter are properly initialized
      const user = await prisma?.userInfo?.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Update user status
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
