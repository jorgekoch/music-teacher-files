import app from "./app";
import { verifyEmailConnection } from "./services/emailService";

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await verifyEmailConnection();
  } catch (error) {
    console.error("Erro ao conectar no SMTP do Gmail:");
    console.error(error);
  }
});