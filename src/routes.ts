import { Router } from 'express';
import { AxleController } from './controllers/AxleController';
import { ModelController } from './controllers/ModelController';
import { NatureController } from './controllers/NatureController';
import { ObjectsController } from './controllers/ObjectsController';
import { ResourceObjectController } from './controllers/ResourceObjectController';
import { verifyToken } from './Utils/functionsToken';
import { BottomToBottomController } from './controllers/bottomToBottomController';
import { GoalController } from './controllers/GoalController';
import { DestinationObjectsControllers } from './controllers/DestinationObjectsControllers';
import { GrantorController } from './controllers/GrantorController';
import { CovenantsController } from './controllers/CovenantsController';
import { DeliveryObjectControllers } from './controllers/DeliveryObjectControllers';

const router = Router();
const objectsController = new ObjectsController();
const natureController = new NatureController();
const modelController = new ModelController();
const axleController = new AxleController();
const grantorController = new GrantorController();
const covenantsController = new CovenantsController();
const destinationObjects = new DestinationObjectsControllers();
const bottomToBottomController = new BottomToBottomController();
const goalController = new GoalController();
const resourceObjectController = new ResourceObjectController();
const deliveryController = new DeliveryObjectControllers();

/*
    5 métodos de requisição HTTP mais utilizados:
    GET => Busca
    POST => salvar
    PUT => Alterar
    DELETE => Deletar
    PATCH => Alteração específica
*/
router.get('/generateToken', objectsController.token);
//fundo a fundo
router.post('/bottomToBottom', verifyToken, bottomToBottomController.create);
router.get('/bottomToBottom', verifyToken, bottomToBottomController.all);
router.get('/bottomToBottom/:id', verifyToken, bottomToBottomController.one);
router.put('/bottomToBottom/:id', verifyToken, bottomToBottomController.update);
router.delete(
  '/bottomToBottom/:id',
  verifyToken,
  bottomToBottomController.remove,
);
router.patch(
  '/bottomToBottom/:id',
  verifyToken,
  bottomToBottomController.restore,
);
//rotas do convenio
router.post('/covenants', verifyToken, covenantsController.create);
router.get('/covenants', verifyToken, covenantsController.all);
router.get('/covenants/:id', verifyToken, covenantsController.one);
router.put('/covenants/:id', verifyToken, covenantsController.update);
router.delete('/covenants/:id', verifyToken, covenantsController.remove);
router.patch('/covenants/:id', verifyToken, covenantsController.restore);

router.post('/grantor', verifyToken, grantorController.create);
router.get('/grantor', verifyToken, grantorController.all);
router.get('/grantor/:id', verifyToken, grantorController.one);
router.put('/grantor/:id', verifyToken, grantorController.update);
router.delete('/grantor/:id', verifyToken, grantorController.remove);
router.patch('/grantor/:id', verifyToken, grantorController.restore);

router.post('/goals', verifyToken, goalController.create);
router.get('/goals', verifyToken, goalController.all);
router.get('/goals/:id', verifyToken, goalController.one);
router.put('/goals/:id', verifyToken, goalController.update);
router.delete('/goals/:id', verifyToken, goalController.remove);
router.patch('/goals/:id', verifyToken, goalController.restore);

// rotas de eixos
router.post('/axles', verifyToken, axleController.create);
router.get('/axles', verifyToken, axleController.all);
router.get('/axles/:id', verifyToken, axleController.one);
router.put('/axles/:id', verifyToken, axleController.update);
router.delete('/axles/:id', verifyToken, axleController.remove);
router.patch('/axles/:id', verifyToken, axleController.restore);

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
router.put('/delivery/:id', verifyToken, deliveryController.update);
router.get('/delivery/:id', verifyToken, deliveryController.one);
router.delete('/delivery/:id', verifyToken, deliveryController.remove);

//Model Routes
router.post('/destinationObjects', verifyToken, destinationObjects.create);
router.get('/destinationObjects', verifyToken, destinationObjects.all);
router.put('/destinationObjects/:id', verifyToken, destinationObjects.update);
router.get('/destinationObjects/:id', verifyToken, destinationObjects.one);
router.delete(
  '/destinationObjects/:id',
  verifyToken,
  destinationObjects.remove,
);

export { router }; // Retornando as rotas preenchidas para o server.ts
