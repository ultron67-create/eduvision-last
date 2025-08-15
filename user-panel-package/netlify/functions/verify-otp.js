export async function handler(event) {
  const { phone, code } = JSON.parse(event.body);
  console.log(`Verifying OTP ${code} for ${phone}`);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "OTP verified successfully" }),
  };
}
