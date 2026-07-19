import { Router } from "express";
import clientController from "../controllers/client.controller.js";

const clientRoutes = Router();

clientRoutes.get("/", clientController.list);
clientRoutes.get("/:id", clientController.findById);
clientRoutes.post("/", clientController.create);
clientRoutes.put("/:id", clientController.update);
clientRoutes.delete("/:id", clientController.delete);


export default clientRoutes;