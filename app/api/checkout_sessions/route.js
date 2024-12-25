import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
export async function POST(request) {
  const { email, totalPrice, clientId } = await request?.json();
  try {
    const session = await stripe?.checkout?.sessions?.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: totalPrice + "00",
            product_data: {
              name: "Press Release",
            },
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      currency: "usd",
      client_reference_id: clientId,
      mode: "payment",
      success_url: `https://dashboard.imcwire.com/thankyou-stripe/${clientId}?isvalid=true`,
      cancel_url: `https://dashboard.imcwire.com/thankyou-stripe/${clientId}?isvalid=false`,
    });
    return NextResponse.json({ sessionId: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: `Checkout Error ${err}` },
      { status: 500 }
    );
  }
}
export async function GET(req, res) {
  const { sessionId } = req?.query;
  try {
    const session = await stripe?.checkout?.sessions?.retrieve(sessionId);
    return NextResponse?.redirect(session?.url);
  } catch (err) {
    return NextResponse.json({ error: ` Error: ${err}` });
  }
}
