import axios from "axios";

export async function POST(request) {
  // First, parse the request body to extract necessary parameters
  const { id } = await request.json();

  // Authenticate and get the token
  const authResponse = await axios.post("https://demoapi.paypro.com.pk/v2/ppro/auth", {
    clientid: "gdR1ajHQejqlw7R",
    clientsecret: "uGEzCKspIzF3rBZ",
  });

  const token = authResponse.headers["token"]; // Make sure the token is correctly provided in the response headers

  // Use the token to make the second API call
  const data = await axios.get(
    `https://demoapi.paypro.com.pk/v2/ppro/ggos?userName=${encodeURIComponent(
      "Tier_Solutions"
    )}&cpayId=${id}`,
    {
      headers: { "Content-Type": "application/json", Token: token },
    }
  );

  // Return the data from the second API call as a JSON response
  return new Response(JSON.stringify(data.data), { status: 200 });
}
