import app from "./app";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️  RESEND_API_KEY não está configurada.");
  }

  if (!process.env.EMAIL_FROM) {
    console.warn("⚠️  EMAIL_FROM não está configurado.");
  }
});