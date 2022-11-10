import { Router } from "express";
import { PlantController } from "../controllers/PlantController";

const plantRouter = Router();

const plantController = new PlantController();

plantRouter.get("/", (req, res) => plantController.getAllPlants(req, res));
plantRouter.get("/:id", (req, res) =>
  plantController.getOnePlantById(req, res)
);
plantRouter.post("/", (req, res) => plantController.createNewPlant(req, res));
plantRouter.put("/:id", (req, res) =>
  plantController.updateOnePlantById(req, res)
);
plantRouter.delete("/:id", (req, res) =>
  plantController.deleteOnePlantById(req, res)
);

export default plantRouter;
