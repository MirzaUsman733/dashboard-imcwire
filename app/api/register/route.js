import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fetch from "node-fetch";

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
  const { name, email, password, role, approved, token } = await request?.json();
  try {
    await prisma.$connect();
    if (!(await verifyRecaptcha(token))) {
      throw new Error("CAPTCHA verification failed");
    }
    // Check if the user already exists
    const existingUser = await prisma?.user?.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await prisma?.user?.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        approved: false,
        status: "active",
      },
    });

    // const mailOptions = {
    //   from: "Orders@imcwire.com",
    //   to: email,
    //   subject: "Welcome to IMCWire",
    //   text: `Dear + ${name} + ,\n\nThank you for registering on our platform. Your account is pending approval by the admin. You will receive another email once your account is approved.\n\nRegards,\nThe Admin`,
    // };
    const mailOptions = {
      from: "Orders@imcwire.com",
      to: email,
      subject: "Welcome to IMCWire",
      html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to IMCWire</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
  
          <div style="background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333;">Dear ${name},</h2>
              <p>Welcome to the IMCWire family! We're thrilled to have you on board and eager to collaborate in amplifying your message globally.</p>
              <p>With a decade of expertise in press release distribution, IMCWire is dedicated to linking you with premier media outlets and organizations, ensuring your news reaches its target audience effectively. Our network boasts esteemed platforms such as Yahoo Finance, Bloomberg, MarketWatch, and over 350 other prominent news and media channels.</p>
              
              <h3 style="color: #333;">Here’s what you can expect with your IMCWire membership:</h3>
              <ul>
                  <li>Unparalleled Distribution: Your press releases will be distributed to leading news outlets, ensuring maximum visibility.</li>
                  <li>Customized Plans: Choose from our Basic, Pro+, and Corporate plans to match your visibility and influence needs.</li>
                  <li>Expert Support: Our team is here to assist you every step of the way, from crafting your press release to tracking its impact.</li>
              </ul>
              
              <h3 style="color: #333;">Getting Started:</h3>
              <ol>
                  <li>Explore Your Dashboard: Log in to your account to access your dashboard, where you can manage your press releases and view their performance.</li>
                  <li>Schedule Your First Release: Ready to launch? Submit your first press release directly through your dashboard or contact our support team for guidance.</li>
                  <li>Reach Out: Have questions or need assistance? Our dedicated support team is just an email or phone call away.</li>
              </ol>
              
              <p><strong>Thank You:</strong> Thank you for choosing IMCWire. We’re honored to play a part in your story and are committed to ensuring your voice is heard loud and clear across the globe.</p>
              
              <p><strong>Let’s make headlines together!</strong></p>
            
          </div>
  
          </body>
          </html>
      `,
    };

    await transporter.sendMail(mailOptions);
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
      const user = await prisma?.user?.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Update user status
      await prisma?.user?.update({
        where: { id: parseInt(id) },
        data: updatedData,
      });

      // Send corresponding email based on status
      let mailOptions = {};

      if (updatedData?.status === "Permanent Block") {
        mailOptions = {
          from: "Orders@imcwire.com",
          to: user?.email,
          subject: "Important Account Notification",
          html: `
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <p>Dear ${user.name},</p>
            <p>We hope this message finds you well. At IMCWire, we are committed to maintaining a secure, respectful, and professional environment for all our users and partners. It is with a sense of responsibility that we uphold these standards to ensure the integrity and quality of our services.</p>
            <p>Following a thorough review, it has been determined that your account has engaged in activities that violate our Terms of Service and Community Standards. Specifically, [briefly describe the nature of the violations, e.g., "the distribution of unauthorized content, misuse of our platform for prohibited activities, etc."]. Despite previous warnings/notices, these behaviors have continued, leading us to take action to protect our community and services.</p>
            <p>Effective immediately, your account has been permanently blocked from accessing IMCWire services. This decision has been made due to:</p>
            <ul>
              <li>Repeated violations despite prior warnings.</li>
              <li>Activities that jeopardize the safety and integrity of our platform and its users.</li>
              <li>Non-compliance with our stated policies and guidelines.</li>
            </ul>
            <p><strong>What This Means:</strong></p>
            <ul>
              <li>You will no longer be able to access your IMCWire account or use any of our services.</li>
              <li>Any active subscriptions or services associated with your account have been terminated.</li>
              <li>This action is final and non-negotiable.</li>
            </ul>
            <p>We understand this news may be disappointing. This decision was not made lightly, but was necessary to maintain the standards and safety of our platform. We must prioritize the well-being and security of our entire community.</p>
            <p>If you believe this decision has been made in error, or if you have any questions, you are welcome to contact our support team for a detailed explanation at [Support Email/Contact Form]. Please note, while we are open to discussion, the likelihood of reversing this decision is minimal given the circumstances.</p>
            <p>Thank you for your understanding.</p>
            <p>Sincerely,<br/>The IMCWire Team</p>
            </div>
            </body>
          `,
        };
      } else if (updatedData?.status === "Temporary Block") {
        mailOptions = {
          from: "Orders@imcwire.com",
          to: user?.email,
          subject: "Temporary Suspension of Your IMCWire Account",
          html: `
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <p>Dear ${user?.name},</p>
            <p>We hope this message finds you well. At IMCWire, we are dedicated to creating and maintaining a safe, respectful, and professional environment for all our users. To uphold these values, we periodically review user activities in accordance with our Terms of Service and Community Standards.</p>
            <p>Upon review, it has been determined that actions associated with your account have violated our policies. Specifically, [briefly describe the nature of the violation, such as "the posting of content that goes against our community guidelines", "engaging in behaviors that disrupt our platform’s integrity", etc.]. These actions necessitate immediate attention to prevent further issues.</p>
            <p>As a result, your account has been temporarily blocked for a period of [duration of the temporary block]. This decision is aimed at addressing the current concerns while also giving you an opportunity to review and understand our community guidelines.</p>
            <p><strong>What This Means:</strong></p>
            <ul>
              <li>During this period, you will not have access to your IMCWire account or be able to use any of our services.</li>
              <li>We encourage you to take this time to familiarize yourself with our Terms of Service and Community Standards, which can be found [link to guidelines].</li>
              <li>Following the suspension period, your account will be automatically reinstated, and you will be able to access and use IMCWire services once again.</li>
            </ul>
            <p>We understand that this may come as a disappointment. However, these measures are essential for maintaining the quality and safety of our platform for all users. We appreciate your understanding and cooperation in this matter.</p>
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Please consider this temporary suspension as an opportunity to review our policies.</li>
              <li>Should you wish to discuss this matter further or if you have any questions regarding the suspension, you are welcome to contact our support team at [Support Email/Contact Form].</li>
            </ul>
            <p>We look forward to welcoming you back to IMCWire after the suspension period has ended. Thank you for your attention to this matter and for your understanding.</p>
            <p>Sincerely,<br/>The IMCWire Team</p>
            </div>
            </body>
          `,
        };
      } else {
        // Handle other status updates if needed
        // You can add additional cases or a default case here
      }

      await transporter?.sendMail(mailOptions);
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
    const planItems = await prisma?.user?.findMany();
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
      const user = await prisma?.user?.findUnique({
        where: { id: parseInt(id) },
      });
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      const userEmail = user?.email;
      const userName = user?.name;
      const mailOptions = {
        from: "Orders@imcwire.com",
        to: userEmail,
        subject: "Press-Release Order",
        text: `Dear + ${userName} + ,\n\nYour Account is Deleted now you cannot access our account`,
      };
      await transporter?.sendMail(mailOptions);
    }
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

// async function verifyRecaptcha(token) {
//   const secretKey = process.env.RECAPTCHA_SECRET_KEY;
//   const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
//     method: "POST",
//     body: JSON.stringify({ token }),
//   });
//   const data = await response.json();
//   return data.success;
// }

async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `secret=${secretKey}&response=${token}`
  });
  const data = await response.json();
  return data.success;
}
