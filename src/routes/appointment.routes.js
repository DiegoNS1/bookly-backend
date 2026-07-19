import { Router } from "express";
import appointmentController from "../controllers/appointment.controller.js";

const appointmentRoutes = Router();

appointmentRoutes.get("/", appointmentController.list);
appointmentRoutes.get("/:id", appointmentController.findById);
appointmentRoutes.post("/", appointmentController.create);
appointmentRoutes.put("/:id", appointmentController.update);
appointmentRoutes.delete("/:id", appointmentController.delete);

export default appointmentRoutes;