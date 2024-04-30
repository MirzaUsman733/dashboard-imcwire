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
  const { name, email, password, role, approved, token } =
    await request?.json();
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
    //   from: "IMCWire <Orders@imcwire.com>",
    //   to: email,
    //   subject: "Welcome to IMCWire",
    //   text: `Dear + ${name} + ,\n\nThank you for registering on our platform. Your account is pending approval by the admin. You will receive another email once your account is approved.\n\nRegards,\nThe Admin`,
    // };
    const mailOptions = {
      from: "IMCWire <Orders@imcwire.com>",
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
              <h2 style="color: #333; font-weight: bold;">Dear ${name},</h2>
              <p>Welcome to the IMCWire family! We're thrilled to have you on board and eager to collaborate in amplifying your message globally.</p>
              <p>With a decade of expertise in press release distribution, IMCWire is dedicated to linking you with premier media outlets and organizations, ensuring your news reaches its target audience effectively. Our network boasts esteemed platforms such as Yahoo Finance, Bloomberg, MarketWatch, and over 350 other prominent news and media channels.</p>
              
              <h3 style="color: #333; font-weight: bold;">As a member, here's what you can anticipate:</h3>
              <ul>
                  <li>Extensive Distribution: Your press releases will reach leading news outlets, maximizing visibility.</li>
                  <li>Tailored Plans: Choose from our plans, and Corporate plans to suit your visibility and influence requirements.</li>
                  <li>Professional Support: Our team is available to guide you every step of the way, from crafting your press release to analyzing its impact.</li>
              </ul>
              
              <h3 style="color: #333; font-weight: bold;">To kick-start your IMCWire experience, we suggest the following steps:</h3>
              <ol>
                  <li>Explore Your Dashboard: Log in to your account to manage your press releases and track performance.</li>
                  <li>Schedule Your First Release: Ready to go live? Submit your debut press release through your dashboard or contact our support team for assistance.</li>
                  <li>Reach Out: Questions or need help? Our dedicated support team is just an email or phone call away.</li>
              </ol>
              
              <p><strong>Thank you for choosing IMCWire. We're honored to be part of your journey and committed to ensuring your voice resonates worldwide.</p>
              
              <p><strong>Let's make headlines together!</strong></p>
              <div class="display: flex; justify-content: space-between; ">
              <div>Warm regards,</div>
              <div>The IMCWire Team</div>
              </div>
            
          </div>
  
          </body>
          </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    const adminEmails = ["admin@imcwire.com", "Abdulaziz.zaidee@gmail.com"]; // Array of admin emails
    const adminMailOptions = {
      from: "IMCWire <Orders@imcwire.com>",
      to: adminEmails.join(","), // Join the admin emails with commas
      subject: "New User Registration",
      text: `A new user has registered with email: ${email}`,
    };
    await transporter.sendMail(adminMailOptions);
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
//         from: "IMCWire <Orders@imcwire.com>",
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
          from: "IMCWire <Orders@imcwire.com>",
          to: user?.email,
          subject: "Important Account Notification",
          html: `
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <p>Dear ${user.name},</p>
            <p>We regret to inform you that your IMCWire account has been permanently blocked due to violations of our Terms of Service. Specifically, you have been engaging in repeated unauthorized distribution of copyrighted material, which is in direct violation of our intellectual property policies. Despite previous warnings, these issues have persisted, compelling us to take this measure to uphold our community’s safety and integrity.
            </p>
            <h3><strong>Implications:</strong></h3>
            <ul>
              <li>Your access to all IMCWire services is revoked immediately.</li>
              <li>Any subscriptions or services linked to your account are terminated.</li>
              <li>This decision is final and binding.</li>
            </ul>
            <p>We understand this may be disappointing, but it is necessary to protect our platform and users. If you have questions or believe this decision to be in error, please contact us at <a mailto="support@imcwire.com">support@imcwire.com</a> for clarification.</p>
           <p>Thank you for your understanding.</p>
            <p>Sincerely,<br/>The IMCWire Team</p>
            </div>
            </body>
          `,
        };
      } else if (updatedData?.status === "Temporary Block") {
        mailOptions = {
          from: "IMCWire <Orders@imcwire.com>",
          to: user?.email,
          subject: "Temporary Suspension of Your IMCWire Account",
          html: `
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h3 class="font-weight: bold;">Dear ${user?.name},</h3>
            <p>We are committed to maintaining a safe and respectful environment at IMCWire. It has been observed that your recent activities have breached our Terms of Service and Community Standards, spestincifically due to po ignappropriate content that does not comply with our guidelines.</p>
          <h3><strong>Impact of Suspension:</strong></h3>
            <ul>
              <li>During this period, you will not have access to your IMCWire account or be able to use any of our services.</li>
              <li>We encourage you to take this time to familiarize yourself with our Terms of Service and Community Standards, which can be found <a href="https://imcwire.com/guidelines/">Guidelines</a>.</li>
              <li>Following the suspension period, your account will be automatically reinstated, and you will be able to access and use IMCWire services once again.</li>
            </ul>
            <p>We understand that this may come as a disappointment. However, these measures are essential for maintaining the quality and safety of our platform for all users. We appreciate your understanding and cooperation in this matter.</p>
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Please consider this temporary suspension as an opportunity to review our policies.</li>
              <li>Should you wish to discuss this matter further or if you have any questions regarding the suspension, you are welcome to contact our support team at <a mailto="support@imcwire.com">support@imcwire.com</a>.</li>
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
      const adminEmails = ["Abdulaziz.zaidee@gmail.com", "admin@imcwire.com"]; // Array of admin emails
      const adminMailOptions = {
        from: "IMCWire <Orders@imcwire.com>",
        to: adminEmails.join(","), // Join the admin emails with commas
        subject: "Account Status Update",
        html: `
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h3>Account Status Update</h3>
            <p>Dear Admins,</p>
            <p>The account status of user ${user.name} (${user.email}) has been updated. Details:</p>
            <ul>
              <li>User ID: ${user.id}</li>
              <li>New Status: ${updatedData.status}</li>
            </ul>
            <p>Please take necessary actions as per the updated status.</p>
            <p>Thank you.</p>
          </div>
          </body>
        `,
      };

      await transporter?.sendMail(mailOptions);
      await transporter?.sendMail(adminMailOptions);
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

// export async function DELETE(req) {
//   try {
//     const url = new URL(req?.url);
//     console.log("URL", url);
//     const id = url?.searchParams?.get("_id");
//     console.log("ID : ", id);
//     const isAdmin = true;
//     if (isAdmin) {
//       // const userDelete = await prisma?.user?.findUnique({
//       //   where: { id: parseInt(id) },
//       // });
//       await prisma.user?.delete({
//         where: { id: id },
//       });
// const userEmail = userDelete?.email;
// const userName = userDelete?.name;
// const mailOptions = {
//   from: "IMCWire <Orders@imcwire.com>",
//   to: userEmail,
//   subject: "Press-Release Order",
//   // text: `Dear + ${userName} + ,\n\nYour Account is Deleted now you cannot access our account`,
//   html: `<!DOCTYPE html>
//   <html lang="en">
//   <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>IMCWire Account Deletion Notification</title>
//   </head>
//   <body  style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">

//   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <p>Dear ${userName}, </p>

//       <p>We regret to inform you that your IMCWire account has been permanently deleted due to repeated violations of our community guidelines, including posting unauthorized content despite multiple warnings. This measure is essential to uphold our Terms of Service and ensure a safe environment for all users.</p>

//       <h2 style="color: #ff0000;">Important Points:</h2>
//       <ul>
//           <li>All personal data associated with your account has been removed from our systems in compliance with data protection laws.</li>
//           <li>You no longer have access to our services or any previously available content.</li>
//       </ul>

//       <p>If you believe this decision was made in error, or if you wish to discuss this matter further, please contact us at <a mailto="support@imcwire.com">support@imcwire.com</a> within [time frame].</p>

//       <p>We value the time you spent with us and regret any inconvenience this decision may cause. Thank you for your understanding as we strive to maintain a secure and respectful platform.</p>

//       <div style="text-align: right; margin-top: 20px;">
//           <p>Best regards,<br>The IMCWire Team</p>
//       </div>
//   </div>

//   </body>
//   </html>
//   `,
// };
// await transporter?.sendMail(mailOptions);
// const adminEmails = ["Abdulaziz.zaidee@gmail.com", "admin@imcwire.com"]; // Array of admin emails
// const adminMailOptions = {
//   from: "IMCWire <Orders@imcwire.com>",
//   to: adminEmails.join(","), // Join the admin emails with commas
//   subject: "User Account Deletion",
//   html: `
//     <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
//     <div style="background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
//       <h3>User Account Deletion</h3>
//       <p>Dear Admins,</p>
//       <p>The account of user ${userName} (${userEmail}) has been permanently deleted.</p>
//       <p>Please review the deletion and take any necessary actions.</p>
//       <p>Thank you.</p>
//     </div>
//     </body>
//   `,
// };
// await transporter?.sendMail(adminMailOptions);
//     }
//     return NextResponse.json(true);
//   } catch (error) {
//     return NextResponse.json({
//       status: 500,
//       message: "Internal Server Error",
//     });
//   }
// }

// async function verifyRecaptcha(token) {
//   const secretKey = process.env.RECAPTCHA_SECRET_KEY;
//   const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
//     method: "POST",
//     body: JSON.stringify({ token }),
//   });
//   const data = await response.json();
//   return data.success;
// }
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("_id");
    const isAdmin = true;

    if (isAdmin) {
      // Check for related login logs
      const loginLogs = await prisma.loginLog.findMany({
        where: { userId: parseInt(id) },
      });

      // Delete related login logs
      await prisma.loginLog.deleteMany({
        where: { userId: parseInt(id) },
      });

      // Delete the user
      const userDelete = await prisma?.user?.findUnique({
        where: { id: parseInt(id) },
      });
      await prisma.user.delete({ where: { id: parseInt(id) } });
      const userEmail = userDelete?.email;
      const userName = userDelete?.name;
      const mailOptions = {
        from: "IMCWire <Orders@imcwire.com>",
        to: userEmail,
        subject: "Press-Release Order",
        // text: `Dear + ${userName} + ,\n\nYour Account is Deleted now you cannot access our account`,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IMCWire Account Deletion Notification</title>
        </head>
        <body  style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <p>Dear ${userName}, </p>
      
            <p>We regret to inform you that your IMCWire account has been permanently deleted due to repeated violations of our community guidelines, including posting unauthorized content despite multiple warnings. This measure is essential to uphold our Terms of Service and ensure a safe environment for all users.</p>
      
            <h2 style="color: #ff0000;">Important Points:</h2>
            <ul>
                <li>All personal data associated with your account has been removed from our systems in compliance with data protection laws.</li>
                <li>You no longer have access to our services or any previously available content.</li>
            </ul>
      
            <p>If you believe this decision was made in error, or if you wish to discuss this matter further, please contact us at <a mailto="support@imcwire.com">support@imcwire.com</a> within [time frame].</p>
      
            <p>We value the time you spent with us and regret any inconvenience this decision may cause. Thank you for your understanding as we strive to maintain a secure and respectful platform.</p>
      
            <div style="text-align: right; margin-top: 20px;">
                <p>Best regards,<br>The IMCWire Team</p>
            </div>
        </div>
      
        </body>
        </html>
        `,
      };
      await transporter?.sendMail(mailOptions);
      const adminEmails = ["Abdulaziz.zaidee@gmail.com", "admin@imcwire.com"]; // Array of admin emails
      const adminMailOptions = {
        from: "IMCWire <Orders@imcwire.com>",
        to: adminEmails.join(","), // Join the admin emails with commas
        subject: "User Account Deletion",
        html: `
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h3>User Account Deletion</h3>
            <p>Dear Admins,</p>
            <p>The account of user ${userName} (${userEmail}) has been permanently deleted.</p>
            <p>Please review the deletion and take any necessary actions.</p>
            <p>Thank you.</p>
          </div>
          </body>
        `,
      };
      await transporter?.sendMail(adminMailOptions);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    }
  );
  const data = await response.json();
  return data.success;
}
