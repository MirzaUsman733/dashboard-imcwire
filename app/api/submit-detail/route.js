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
      const userEmail = planDoc?.storeData?.formDataSignUp?.email; 
      const userName = planDoc?.storeData?.formDataSignUp?.name; 
      const userMailOptions = {
        from: "IMCWire <Orders@imcwire.com>",
        to: userEmail,
        subject: "Press Release Submission Confirmation",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Press Release Submission Confirmation</title>
        </head>
        <body>
          <div>
            <h2>Press Release Submission Confirmation</h2>
            <p>Dear ${userName},</p>
            <p>Thank you for choosing IMCWire for your press release needs. We're eager to help broadcast your message through our vast network of media outlets.</p>
            
            <h3>Order Status:</h3>
            <ul>
              <li><strong>Order ID:</strong> ${planDoc?.storeData?.clientId}</li>
              <li><strong>Plan:</strong> ${planDoc?.storeData?.matchedPlanData?.planName}</li>
              <li><strong>Submitted on:</strong> ${planDoc?.storeData?.matchedPlanData?.createdAt} </li>
            </ul>
            
            <h3>Next Steps:</h3>
            <p><strong>Review Process:</strong> Our team is currently reviewing your submission to ensure it meets our quality and content standards.</p>
            <p><strong>Approval Notification:</strong> We will email you as soon as your order is approved and processing begins.</p>
            <p><strong>Distribution:</strong> Once approved, your press release will be scheduled for distribution as per your plan's timeline.</p>
            
            <p>We appreciate your patience during the review and strive to expedite this process. Should you have any queries or need further assistance, please contact us at <strong><a mailto="support@imcwire.com">support@imcwire.com</a></strong>.</p>
            
            <p>We're committed to achieving maximum visibility and impact for your press release and look forward to a successful distribution.</p>
            
            <p>Warm regards,<br>The IMCWire Team</p>
          </div>
        </body>
        </html>
        `,
      };
      await transporter.sendMail(userMailOptions);

      // Send alert email to admin(s)
      const adminEmails = ["Abdulaziz.zaidee@gmail.com", "admin@imcwire.com"]; // Array of admin emails
      const adminMailOptions = {
        from: "IMCWire <Orders@imcwire.com>",
        to: adminEmails.join(","), // Join the admin emails with commas
        subject: "New Press Release Submission",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Press Release Submission</title>
        </head>
        <body>
          <div>
            <h2>New Press Release Submission</h2>
            <p>A new press release has been submitted and is awaiting approval:</p>
            <ul>
              <li><strong>User Name:</strong> ${userName}</li>
              <li><strong>User Email:</strong> ${userEmail}</li>
            </ul>
          </div>
        </body>
        </html>
        `,
      };
      await transporter.sendMail(adminMailOptions);

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
    console.log(user);
    const userEmail = user?.storeData?.formDataSignUp?.email;
    const userName = user?.storeData?.formDataSignUp?.name;
    let emailSubject, emailText;
    // Determine email subject and text based on updatedData.action
    switch (updatedData?.storeData?.action) {
      case "pending":
        emailSubject = "Your IMCWire Press Release Order is Pending Approval";
        emailText = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>IMCWire Press Release Order Status</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2>Dear ${userName},</h2>
            <p>Thank you for choosing IMCWire for your press release needs. We're eager to help broadcast your message through our vast network of media outlets.</p>
            
            <h3>Order Status:</h3>
            <ul>
              <li><strong>Order ID:</strong> ${user?.clientId}</li>
              <li><strong>Plan:</strong> ${user?.matchedPlanData?.planName}</li>
              <li><strong>Submitted on:</strong> ${user?.matchedPlanData?.createdAt} </li>
            </ul>
            
            <h3>Next Steps:</h3>
            <p><strong>Review Process:</strong> Our team is currently reviewing your submission to ensure it meets our quality and content standards.</p>
            <p><strong>Approval Notification:</strong> We will email you as soon as your order is approved and processing begins.</p>
            <p><strong>Distribution:</strong> Once approved, your press release will be scheduled for distribution as per your plan's timeline.</p>
            
            <p>We appreciate your patience during the review and strive to expedite this process. Should you have any queries or need further assistance, please contact us at <strong><a mailto="support@imcwire.com">support@imcwire.com</a></strong>.</p>
            
            <p>We're committed to achieving maximum visibility and impact for your press release and look forward to a successful distribution.</p>
            
            <p>Warm regards,<br>The IMCWire Team</p>
          </div>
        </body>
        </html>
        `;
        break;
      case "approved":
        emailSubject =
          "Your Press Release Distribution is Approved – View Your Report!";
        emailText = `<!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Press Release Approval</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h3 style="font-weight: bold">Dear ${userName},</h3>
          <h3 style="font-weight: bold">Status: Approved</h3>
          <p>We're delighted to inform you that your press release has been approved and is ready for distribution through IMCWire!</p>
          <p>Your press release has met our quality standards and is set to make an impact.</p>
          <p><strong>Next Steps:</strong></p>
          <ul>
          <li><strong>Distribution:</strong> Your press release will now be distributed to our extensive network of media outlets.</li>
          <li><strong>Notification:</strong> Expect an email notification once your press release is published, along with links to where it can be found.</li>
          <li><strong>Tracking:</strong> Detailed reports will be provided to track the performance of your press release in terms of visibility and engagement.</li>
          </ul>
          <p>If you have any questions or need further assistance, please feel free to contact our support team at <a mailto="support@imcwire.com">support@imcwire.com</a>.</p>
          <p>Thank you for entrusting IMCWire with your press release. We're excited to help you share your news with the world!</p>
          <p>Best regards,<br>The IMCWire Team</p>
          </div>
          </body>
          </html>
          `;
        break;
      case "inprogress":
        emailSubject = "Your Press Release is Now In Progress";
        emailText = `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Press Release Underway</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h3 style="font-weight: bold">Dear ${userName},</h3>
          <h3 style="font-weight: bold">Status: Approved</h3>
        <p>Exciting news—your press release is officially underway at IMCWire! We're committed to maximizing the reach of your story through our extensive network of media outlets.</p>
        <p><strong>Order Details:</strong></p>
        <ul>
        <li><strong>Order ID:</strong> ${user?.clientId}</li>
        <li><strong>Plan Selected:</strong> ${user?.matchedPlanData?.planName}</li>
        <li><strong>Status:</strong> In Progress</li>
        </ul>
        <p><strong>Next Steps:</strong></p>
        <ul>
        <li><strong>Distribution:</strong> We are preparing your press release for distribution as per your selected plan to ensure a successful launch.</li>
        <li><strong>Notification:</strong> You will be notified via email as soon as your press release is published, including links to where it can be found.</li>
        <li><strong>Tracking:</strong> Expect detailed reports to track your press release’s performance in terms of visibility and engagement.</li>
        </ul>
        <p>We value your trust in our ability to communicate your news effectively. If you have any questions or need assistance during this process, please don't hesitate to reach out to our support team at <a mailto="support@imcwire.com">support@imcwire.com</a>.</p>
        <p>Thank you for partnering with IMCWire. We look forward to making your press release a success!</p>
        <p>Best regards,<br>The IMCWire Team</p>
        </div>
        </body>
        </html>
        `;
        break;
      case "completed":
        emailSubject =
          "Your Press Release Distribution is Complete – View Your Report!";
        emailText = `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Press Release Distribution Completion</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <p>Dear ${userName},</p>
        <p>We're pleased to inform you that the distribution of your press release is complete! Here are the quick details:</p>
        <ul>
        <li><strong>Order ID:</strong> ${user?.clientId}</li>
        <li><strong>Plan:</strong> ${user?.matchedPlanData?.planName}</li>
        <li><strong>Status:</strong> Completed</li>
        </ul>
        <p><strong>Access Your Report:</strong></p>
        <p>To view the detailed report of your press release’s performance, including visibility, reach, and engagement metrics, please follow this link: <a href="[View Report Link]">View Report</a>. You can also access the report via your IMCWire Dashboard under the "Reports" section.</p>
        <p><strong>Next Steps:</strong></p>
        <ul>
<li>Review the Report: Analyze the results to fine-tune your future communications.</li>
<li>Plan Ahead: Consider your next press release. We’re here to help it succeed.</li>
<li>Provide Feedback: Your insights are invaluable to us. Please share any feedback.</li>
</ul>
<p>Thank you for choosing IMCWire. We look forward to assisting you with your future communication needs.</p>
<p>If you need further assistance, contact our support team at <a mailto="support@imcwire.com">support@imcwire.com</a>.</p>
</div>
</body>
</html>
        .`;
        break;

      default:
        emailSubject = "Updated Press-Release Order";
        emailText = `Dear ${userName},\n\nYour order is updated now with action: ${updatedData?.storeData?.action}.`;
    }

    const mailOptions = {
      from: "IMCWire <Orders@imcwire.com>",
      to: userEmail,
      subject: emailSubject,
      html: emailText,
    };

    await transporter.sendMail(mailOptions);
    const adminEmails = ["admin@imcwire.com", "Abdulaziz.zaidee@gmail.com"]; // Array of admin emails
    const adminMailOptions = {
      from: "IMCWire <Orders@imcwire.com>",
      to: adminEmails.join(","), // Join the admin emails with commas
      subject: "Press Release Order Update Alert",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Press Release Order Update Alert</title>
        <style>
          /* Add your CSS styles here */
        </style>
      </head>
      <body>
        <div>
          <h2>Press Release Order Update Alert</h2>
          <p>An update has been made to a press release order:</p>
          <ul>
            <li><strong>User Name:</strong> ${userName}</li>
            <li><strong>User Email:</strong> ${userEmail}</li>
            <li><strong>Action Taken:</strong> ${updatedData?.storeData?.action}</li>
          </ul>
        </div>
      </body>
      </html>
      `,
    };
    await transporter.sendMail(adminMailOptions);
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
