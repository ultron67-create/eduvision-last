export async function handler(event) {
  const { phone } = JSON.parse(event.body);
  console.log(`OTP requested for ${phone}`);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "OTP sent successfully" }),
  };
}
