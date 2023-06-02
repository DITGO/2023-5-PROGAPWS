import { Router } from 'express';
import { AxleController } from './controllers/AxleController';
import { ModelController } from './controllers/ModelController';
import { NatureController } from './controllers/NatureController';
import { ObjectsController } from './controllers/ObjectsController';
import { ResourceController } from './controllers/ResourceController';
import { DestinationController } from './controllers/DestinationController';
import { DeliveryObjectController } from './controllers/DeliveryObjectController';
import { ResourceObjectController } from './controllers/ResourceObjectController';
import { verifyToken } from './Utils/functionsToken';

const router = Router();
const objectsController = new ObjectsController();
const natureController = new NatureController();
const modelController = new ModelController();
const axleController = new AxleController();
const resourceController = new ResourceController();
const destinationController = new DestinationController();
const resourceObjectController = new ResourceObjectController();
const deliveryController = new DeliveryObjectController();

/*
    5 métodos de requisição HTTP mais utilizados:
    GET => Busca
    POST => salvar
    PUT => Alterar
    DELETE => Deletar
    PATCH => Alteração específica
*/
router.get('/generateToken', objectsController.token);

//rotas de recursos
router.post('/resources', resourceController.create);
router.get('/resources', resourceController.all);
router.get('/resources/:id', verifyToken, resourceController.one);
router.put('/resources/:id', verifyToken, resourceController.update);
router.delete('/resources/:id', verifyToken, resourceController.remove);
router.patch('/resources/:id', verifyToken, resourceController.restore);

// rotas de eixos
router.post('/axles', verifyToken, axleController.create);
router.get('/axles', verifyToken, axleController.all);
router.get('/axles/:id', verifyToken, axleController.one);
router.put('/axles/:id', verifyToken, axleController.update);
router.delete('/axles/:id', verifyToken, axleController.remove);
router.patch('/axles/:id', verifyToken, axleController.restore);

//rotas de destinação
router.post('/destinations', verifyToken, destinationController.create);
router.get('/destinations', verifyToken, destinationController.all);
router.get('/destinations/:id', verifyToken, destinationController.one);
router.put('/destinations/:id', verifyToken, destinationController.update);
router.delete('/destinations/:id', verifyToken, destinationController.remove);
router.patch('/destinations/:id', verifyToken, destinationController.restore);

// objetos do recursos
router.post('/resourceobjects', verifyToken, resourceObjectController.create);
router.get('/resourceobjects', verifyToken, resourceObjectController.all);
router.get('/resourceobjects/:id', verifyToken, resourceObjectController.one);
router.put(
  '/resourceobjects/:id',
  verifyToken,
  resourceObjectController.update,
);
router.delete(
  '/resourceobjects/:id',
  verifyToken,
  resourceObjectController.remove,
);
router.patch(
  '/resourceobjects/:id',
  verifyToken,
  resourceObjectController.restore,
);

//Objects Routes
router.post('/objects', verifyToken, objectsController.create);
router.get('/objects', verifyToken, objectsController.all);
router.get('/objects/:id', verifyToken, objectsController.one);
router.put('/objects/:id', verifyToken, objectsController.update);
router.delete('/objects/:id', verifyToken, objectsController.remove);
router.patch('/objects/:id', verifyToken, objectsController.restore);

//Nature Routes
router.post('/nature', verifyToken, natureController.create);
router.get('/nature', verifyToken, natureController.all);
router.get('/nature/:id', verifyToken, natureController.one);
router.put('/nature/:id', verifyToken, natureController.update);
router.delete('/nature/:id', verifyToken, natureController.remove);
router.patch('/nature/:id', verifyToken, natureController.restore);

//Model Routes
router.post('/model', verifyToken, modelController.create);
router.get('/model', verifyToken, modelController.all);
router.get('/model/:id', verifyToken, modelController.one);
router.put('/model/:id', verifyToken, modelController.update);
router.delete('/model/:id', verifyToken, modelController.remove);
router.patch('/model/:id', verifyToken, modelController.restore);

//Model Routes
router.post('/delivery', verifyToken, deliveryController.create);
router.get('/delivery', verifyToken, deliveryController.all);
router.get('/delivery', verifyToken, deliveryController.one);
router.delete('/delivery/:id', verifyToken, deliveryController.remove);

export { router }; // Retornando as rotas preenchidas para o server.ts
