// pages/api/auth.js

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { clientid, clientsecret } = await req.json();

    // Make the POST request to the external API
    const response = await fetch("https://demoapi.paypro.com.pk/v2/ppro/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientid,
        clientsecret
      }),
    });
    console.log(response)
    console.log("Headers Token: ",response?.headers?.get('token'))
    const result = await response.json();
    console.log(result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
