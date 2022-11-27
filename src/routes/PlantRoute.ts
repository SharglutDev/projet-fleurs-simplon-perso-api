import { Router } from 'express';
import { PlantController } from '../controllers/PlantController';
import { authenticate } from '../middlewares/authenticate';

const plantRouter = Router();

const plantController = new PlantController();

plantRouter.get('/', (req, res) => plantController.getAllPlants(req, res));
plantRouter.get('/:id', (req, res) =>
  plantController.getOnePlantById(req, res)
);
plantRouter.post('/', authenticate, (req, res) =>
  plantController.createNewPlant(req, res)
);
plantRouter.put('/:id', authenticate, (req, res) =>
  plantController.updateOnePlantById(req, res)
);
plantRouter.delete('/:id', authenticate, (req, res) =>
  plantController.deleteOnePlantById(req, res)
);

export default plantRouter;
