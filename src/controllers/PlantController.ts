import { Request, Response } from "express";
import { Plant } from "../models/interfaces/PlantInterface";
import { PlantService } from "../services/PlantService";

export class PlantController {
  public plantService = new PlantService();

  async getAllPlants(req: Request, res: Response): Promise<void> {
    try {
      const allPlants = await this.plantService.getAllPlants();
      res.send({ status: "OK", data: allPlants });
    } catch (error: any) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  }

  async getOnePlantById(req: Request, res: Response): Promise<void> {
    const paramId = parseInt(req.params.id);

    if (!paramId) {
      res
        .status(400)
        .send({ status: "FAILED", data: { error: `Please enter a valid id` } });
      return;
    }

    try {
      const foundPlant = await this.plantService.getOnePlantById(paramId);
      if (foundPlant) {
        res.send({ status: "OK", data: foundPlant });
      } else {
        res.status(404).send({
          status: "FAILED",
          data: { error: `Plant with id ${paramId} doesn't exist` },
        });
      }
    } catch (error: any) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  }

  async createNewPlant(req: Request, res: Response): Promise<void> {
    const newPlant: Plant = { ...req.body };
    const plantPropValues = Object.values(newPlant);

    if (
      plantPropValues.some((propValue) =>
        propValue.toString().match(/^[^a-zA-Z0-9]+$/)
      )
    ) {
      res.status(400).send({
        status: "FAILED",
        data: { error: `Property(ies) wrong or missing` },
      });
      return;
    }

    try {
      await this.plantService.createNewPlant(newPlant);
      res.send({
        status: "OK",
        message: `new Plant successfully created`,
        data: newPlant,
      });
    } catch (error: any) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  }

  async updateOnePlantById(req: Request, res: Response): Promise<void> {
    const paramId = parseInt(req.params.id);
    const updatedPlant: Plant = { ...req.body };
    const updatedPlantPropsValues = Object.values(updatedPlant);

    if (!paramId) {
      res.status(400).send({
        status: "FAILED",
        data: { error: `Please enter a valid id` },
      });
      return;
    }

    if (
      updatedPlantPropsValues.some((propValue) =>
        propValue.toString().match(/^[^a-zA-Z0-9]+$/)
      )
    ) {
      res.status(400).send({
        status: "FAILED",
        data: { error: `Property(ies) wrong or missing` },
      });
      return;
    }

    try {
      const plantToUpdate: Plant = await this.plantService.updateOnePlant(
        updatedPlant,
        paramId
      );
      if (plantToUpdate) {
        res.send({
          status: "OK",
          message: `Plant with id ${paramId} successfully updated`,
          data: updatedPlant,
        });
      } else {
        res.status(404).send({
          status: "FAILED",
          data: { error: `Plant with id ${paramId} doesn't exist` },
        });
      }
    } catch (error: any) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  }

  async deleteOnePlantById(req: Request, res: Response): Promise<void> {
    const paramId = parseInt(req.params.id);

    if (!paramId) {
      res
        .status(404)
        .send({ status: "FAILED", data: { error: `Please enter a valid id` } });
    }

    try {
      const plantToDelete = await this.plantService.deleteOnePlant(paramId);

      if (plantToDelete) {
        res.send({
          status: "OK",
          message: `Plant with id ${paramId} successfully deleted`,
          data: plantToDelete,
        });
      } else {
        res.status(404).send({
          status: "FAILED",
          data: { error: `Plant with id ${paramId} doesn't exist` },
        });
      }
    } catch (error: any) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
