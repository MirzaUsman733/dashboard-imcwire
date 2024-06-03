// pages/api/createOrder.js

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, totalPrice, clientId } = await req.json();

    // Authenticate and get the token
    const authResponse = await fetch(`${process.env.Paypro_URL}/v2/ppro/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientid: process.env.clientid || 'gdR1ajHQejqlw7R',
        clientsecret: process.env.clientsecret || 'uGEzCKspIzF3rBZ',
      }),
    });

    if (!authResponse.ok) {
      return NextResponse.json({ status: 401, message: 'Authentication failed' });
    }

    const authResult = await authResponse.text();
    const token = authResponse.headers.get('Token');
    console.log(authResult, token)
    if (authResult === "Authorized" || !token) {
      return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const issueDate = new Date();
    const orderDueDate = new Date(issueDate);
    orderDueDate.setDate(issueDate.getDate() + 1);

    const formattedIssueDate = issueDate.toISOString().split('T')[0];
    const formattedOrderDueDate = orderDueDate.toISOString().split('T')[0];

    const orderPayload = [
      {
        "MerchantId": "Tier_Solutions"
      },
      {
        "OrderNumber":   clientId,
        "CurrencyAmount": "59.99",
        "Currency": "PKR",
        "OrderDueDate": formattedOrderDueDate,
        "OrderType": "Service",
        "IsConverted": "true",
        "IssueDate": formattedIssueDate,
        "OrderExpireAfterSeconds": "0",
        "CustomerName": name || "Arbaz Abid",
        "CustomerMobile": "",
        "CustomerEmail": email || "",
        "CustomerAddress": "House P-1233, Street 223, New Colony Faisalabad 38000 Punjab PK"
      }
    ];

    // Create order using the token
    const orderResponse = await fetch(`${process.env.Paypro_URL}/v2/ppro/co`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': `${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const result = await orderResponse.json();
    console.log(result)
    if (orderResponse.ok && result[0]?.Status === "00") {
      const click2PayUrl = result[1]?.Click2Pay;
      if (click2PayUrl) {
        const finalUrl = `${click2PayUrl}&callback_url=http://localhost:3000/thankyou`;
        return NextResponse.json({ finalUrl });
      } else {
        return NextResponse.json({ status: 500, message: "Click2Pay URL not found" });
      }
    } else {
      return NextResponse.json({ status: 500, message: "Order creation failed" });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error"
    });
  }
}
