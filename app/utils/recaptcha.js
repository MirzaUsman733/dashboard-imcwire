async function verifyCaptcha(token) {
  console.log(token)
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;
console.log(process.env.RECAPTCHA_SECRET_KEY)
console.log(token)
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.success;
}

export default verifyCaptcha;

