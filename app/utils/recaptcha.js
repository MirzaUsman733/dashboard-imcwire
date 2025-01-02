// import fetch from 'node-fetch';
async function verifyCaptcha(token) {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${`6Lddy8cpAAAAAO3ewWPTir9PbX-qoBw6u2aYufeS`}&response=${token}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.success;
}

export default verifyCaptcha;
