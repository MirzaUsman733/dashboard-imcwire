import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const endpointSecret = process?.env?.STRIPE_WEBHOOK_SECRET;
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
  const rawBody = await req?.text();
  const stripeSignature = req?.headers?.get("stripe-signature");

  const stripe = new Stripe(process?.env?.STRIPE_SECRET_KEY, {
    apiVersion: "2020-08-27",
  });

  try {
    // Construct event
    const event = stripe?.webhooks?.constructEvent(
      rawBody,
      stripeSignature,
      endpointSecret
      // "whsec_fb6c19ecda25a2edc0f36677ef3f3433cededf183b362ab582db98ad4a9883d2"
    );

    // Connect to database
    await prisma.$connect();
    if (event?.type === "checkout.session.completed") {
      // Save event to database
      await prisma.webhookEvent.create({
        data: {
          eventType: event?.type,
          eventData: event?.data,
        },
      });
    }

    if (
      event?.type === "checkout.session.completed" &&
      event?.data?.object?.payment_status === "paid"
    ) {
      const clientReferenceId = event?.data?.object?.client_reference_id;
      const compaignData = await prisma?.compaignData?.findUnique({
        where: { clientId: clientReferenceId },
      });
      await prisma?.compaignData?.update({
        where: { clientId: clientReferenceId },
        data: { status: "paid", transactionId: clientReferenceId },
      });
      const formattedAmount = (event?.data?.object?.amount_total / 100).toFixed(
        2
      );
      const receiptEmail = event?.data?.object?.customer_email;
      const mailOptions = {
        from: "IMCWire <Orders@imcwire.com>",
        to: receiptEmail,
        subject:
          "Your Payment Has Been Successfully Processed - Welcome to IMCWire!",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Payment Has Been Successfully Processed - Welcome to IMCWire!</title>
        </head>
        <body style="font-family: Arial, sans-serif;">

        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
            <h2 style="text-align: center; color: #333;">Your Payment Has Been Successfully Processed - Welcome to IMCWire!</h2>
            
            <p>Dear ${receiptEmail},</p>
            
            <p>We are delighted to inform you that your payment has been successfully processed, and your subscription to IMCWire is now active. Welcome aboard!</p>
            
            <p>Here's a quick recap of the plan you've chosen:</p>
            
            <ul>
                <li><strong>Plan Name:</strong> ${compaignData?.matchedPlanData?.planName}</li>
                <li><strong>Number Of:</strong> You are buying the ${compaignData?.matchedPlanData?.numberOfPR} </li>
                <li><strong>Total Amount Paid:</strong> $ ${formattedAmount}</li>
            </ul>
            
            <p>Your decision to choose IMCWire as your press release distribution partner marks the beginning of an exciting journey. We are committed to providing you with the highest level of service and ensuring your news reaches your targeted audience through premier outlets like Yahoo Finance, Bloomberg, MarketWatch, and many more.</p>
            
            <p><strong>What's Next?</strong></p>
            
            <ol>
                <li><strong>Dashboard Access:</strong> You can now access your personalized dashboard <a href="dashboard.imcwire.com/press-dashboard/pr-balance">here</a>, where you can manage your press releases, view distribution reports, and access exclusive insights.</li>
                <li><strong>Schedule Your First Release:</strong> Ready to get started? Schedule your first press release for distribution through your dashboard. If you need any assistance or have special requests, our support team is here to help.</li>
                <li><strong>Support and Assistance:</strong> For any questions, guidance, or support, feel free to reach out to us at support@imcwire.com. We're here to ensure your experience is seamless and successful.</li>
            </ol>
            
            <p>We're thrilled to have you with us and look forward to supporting your success. Here's to making headlines together!</p>
            
            <p><strong>Warm regards,</strong><br>The IMCWire Team</p>
        </div>

        </body>
        </html>`,
      };
      const adminEmails = ["admin@imcwire.com", "imcwirenotifications@gmail.com"]; 
      const adminMailOptions = {
        from: "IMCWire <Orders@imcwire.com>",
        to: adminEmails.join(","),
        subject: `New Payment Received - ${compaignData?.formDataSignUp?.name} Subscription Activation`,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Payment Received - ${compaignData?.formDataSignUp?.name} Subscription Activation</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
      
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
            <h2 style="text-align: center; color: #333;">New Payment Received - ${compaignData?.formDataSignUp?.name} Subscription Activation</h2>
            
            <p>Dear Team,</p>
            
            <p>We are pleased to report that a payment has been successfully processed and a new subscription has been activated. Please find the transaction details below for record-keeping and further action if necessary.</p>
            
            <h3>Customer Details:</h3>
            <ul>
                <li><strong>Name:</strong> ${compaignData?.formDataSignUp?.name}</li>
                <li><strong>Email:</strong> ${compaignData?.formDataSignUp?.email}</li>
                <li><strong>Plan Subscribed:</strong> ${compaignData?.matchedPlanData?.planName}</li>
            </ul>
            
            <h3>Payment Details:</h3>
            <ul>
            <li><strong>Total Amount Paid:</strong> $ ${formattedAmount}</li>
                <li><strong>Transaction ID:</strong> ${clientReferenceId}</li>
            </ul>
            
            <h3>Next Steps & Notes:</h3>
            <ul>
                <li>Please ensure that the customer's account is fully activated and has access to all the relevant features included in their subscription plan.</li>
                <li>A welcome email and payment confirmation have been sent to the customer.</li>
                <li>Monitor the customer's first press release submission and offer assistance as needed to ensure a smooth start.</li>
            </ul>
            
            <p><strong>Customer Support:</strong> Should the customer reach out for support or further inquiries, please be prepared to assist promptly. Let’s ensure ${compaignData?.formDataSignUp?.name}'s experience with IMCWire is positive and successful from the outset.</p>
            
            <p>Thank you for your attention to this new activation, and let's continue working together to provide exceptional service to our clients.</p>
            
        </div>
      
        </body>
        </html>`,
      };

      // Send email
      await transporter?.sendMail(mailOptions);
      await transporter?.sendMail(adminMailOptions);
    }

    await prisma?.$disconnect();

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Web Hook Error ${error}` },
      { status: 400 }
    );
  }
}

export async function PUT(req) {
  try {
    const { ...data } = await req.json();
    const url = new URL(req.url);
    const id = url.searchParams.get("_id");
    const isAdmin = true;
    if (isAdmin) {
      await prisma.webhookEvent.update({
        where: { id: parseInt(id) },
        data: { ...data },
      });
    }
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.error({
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
      const webhookData = await prisma.webhookEvent.findOne({
        where: { client_reference_id: id },
      });
      return NextResponse.json(webhookData);
    }
    const allWebhookData = await prisma.webhookEvent.findMany();
    return NextResponse.json(allWebhookData);
  } catch (error) {
    return NextResponse.error({
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
      await prisma.webhookEvent.delete({ where: { id: Number(id) } });
    }
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.error({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
