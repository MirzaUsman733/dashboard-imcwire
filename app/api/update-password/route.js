import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export const POST = async (request) => {
  const { newPassword, resetToken } = await request?.json();
  try {
    await prisma.$connect();
    const user = await prisma?.user?.findFirst({ where: { resetToken } });

    if (!user) {
      return new NextResponse("Invalid reset token", { status: 400 });
    }
    if (new Date() > user?.tokenExpiration) {
      return new NextResponse("Reset token has expired", { status: 400 });
    }
    const hashedPassword = await bcrypt?.hash(newPassword, 10);
    const email = user?.email;
    await prisma?.user?.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null,
        tokenExpiration: null, 
      },
    });
    await prisma?.$disconnect();

    return new NextResponse("Password updated successfully.", {
      status: 200,
    });
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
