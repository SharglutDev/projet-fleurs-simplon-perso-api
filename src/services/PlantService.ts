import { AppDataSource } from "../data-source";
import { Plant } from "../models/interfaces/PlantInterface";

export class PlantService {
  getAllPlants(): Promise<Plant[]> {
    return AppDataSource.query(`SELECT * from plant;`);
  }

  getOnePlantById(id: number): Promise<Plant> {
    return AppDataSource.query(`SELECT * from plant as p WHERE p.id = ${id};`);
  }

  createNewPlant(newPlant: Plant): Promise<void> {
    return AppDataSource.query(
      `INSERT INTO plant (name, unitprice_ati, quantity, category, rating, url_picture) VALUES ('${newPlant.name}', ${newPlant.unitprice_ati}, ${newPlant.quantity}, '${newPlant.category}', ${newPlant.rating}, '${newPlant.url_picture}');`
    );
  }

  updateOnePlant(updatedPlant: Plant, id: number): Promise<Plant> {
    AppDataSource.query(
      `UPDATE plant as p SET name = '${updatedPlant.name}', unitprice_ati = ${updatedPlant.unitprice_ati}, quantity = ${updatedPlant.quantity}, category = '${updatedPlant.category}', rating = '${updatedPlant.rating}', url_picture = '${updatedPlant.url_picture}' WHERE p.id = ${id};`
    );
    return AppDataSource.query(`SELECT * from plant as p WHERE p.id = ${id};`);
  }

  deleteOnePlant(id: number): Promise<Plant> {
    AppDataSource.query(`DELETE FROM plant as p WHERE p.id = ${id};`);
    return AppDataSource.query(`SELECT * from plant as p WHERE p.id = ${id};`);
  }
}
