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


export const POST = async (request) => {
  const { email } = await request?.json();
  try {
    await prisma?.$connect();
    const user = await prisma?.user?.findUnique({ where: { email } });

    if (!user) {
      return new NextResponse("User Not Found", { status: 404 });
    }


    // Hash the password
    const resetToken = generateResetToken();
    const tokenExpiration = new Date();
    tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 30);
    await prisma?.user?.update({
      where: { email },
      data: { resetToken, tokenExpiration },
    });
    const mailOptions = {
      from: "IMCWire <Orders@imcwire.com>",
      to: email,
      subject: "Forget Password",
      html: `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Forget Password</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
              }
      
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
      
              h1 {
                  color: #333;
                  text-align: center;
              }
      
              p {
                  color: #555;
                  font-size: 16px;
                  line-height: 1.6;
                  margin-bottom: 20px;
              }
      
              .btn {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: white !important;
                  text-decoration: none;
                  border-radius: 5px;
                  transition: background-color 0.3s ease;
                  margin: auto;
              }
      
              .btn:hover {
                  background-color: #0056b3;
                  color: white;
              }
      
              .footer {
                  margin-top: 20px;
                  text-align: center;
                  color: #888;
              }
          </style>
      </head>
      
      <body>
          <div class="container">
              <h1>Forget Password</h1>
              <p>You recently requested to reset your password. Click the button below to reset it:</p>
              <div style="display: flex; justify-content: center;">
              <a class="btn" href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a>
              </div>
              <p class="footer">If you did not request this, please ignore this email.</p>
          </div>
      </body>
      
      </html>
      `,
    };
    await transporter?.sendMail(mailOptions);
    const adminEmails = ["admin@imcwire.com", "imcwirenotifications@gmail.com"]; // Array of admin emails
    // const adminEmails = ["mirzausman9006@gmail.com", "hafizusman733k@gmail.com"]; // Array of admin emails

    const adminMailOptions = {
      from: "IMCWire <Orders@imcwire.com>",
      to: adminEmails.join(","), // Join the admin emails with commas
      subject: "Password Reset Request",
      text: `A password reset request has been made for the user with email: ${email}`,
    };
    await transporter?.sendMail(adminMailOptions);
    await prisma?.$disconnect();

    return new NextResponse("User is registered.", {
      status: 200,
    });
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

function generateResetToken() {
  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  return token;
}
