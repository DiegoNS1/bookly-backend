import { Router } from "express";
import serviceController from "../controllers/service.controller.js"

const serviceRoutes = Router();

serviceRoutes.get("/", serviceController.list)
serviceRoutes.get("/:id", serviceController.findById)
serviceRoutes.post("/", serviceController.create);
serviceRoutes.put("/:id", serviceController.update)
serviceRoutes.delete("/:id", serviceController.delete)

export default serviceRoutes;