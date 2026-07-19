import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./database/prisma.js";
import clientRoutes from "./routes/client.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";


const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/clients", clientRoutes);
app.use("/services", serviceRoutes);
app.use("/appointments", appointmentRoutes);
app.use(errorMiddleware);

app.get("/", (request, response) => {
  return response.json({
    message: "API Bookly funcionando 🚀",
  });
});

app.get("/test-database", async (request, response) => {
  const clients = await prisma.client.findMany();

  return response.json(clients);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});