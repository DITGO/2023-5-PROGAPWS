import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { ResourceObject } from '../models/ResourceObject';
import { DeliveryObjects } from '../models/DeliveryObjects';

class DeliveryObjectController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { deliveryDate, amountDelivery, observation, destinations } =
      request.body;

    const schema = yup.object().shape({
      deliveryDate: yup.string().required(),
      amountDelivery: yup.string().required(),
      observation: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const deliveryObjectRepository =
      APPDataSource.getRepository(DeliveryObjects);

    const deliveryObject = deliveryObjectRepository.create({
      deliveryDate,
      amountDelivery,
      observation,
      destinations,
    });

    await deliveryObjectRepository.save(deliveryObject);

    return response.status(201).json(deliveryObject);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const deliveryObjectRepository =
      APPDataSource.getRepository(DeliveryObjects);

    const all = await deliveryObjectRepository.find({
      relations: {
        destinations: true,
      },
    });

    return response.json(all);
  }

  // EXCLUÇÃO PERMANETE
  async remove(request: Request, response: Response, next: NextFunction) {
    const deliveryObjectRepository =
      APPDataSource.getRepository(DeliveryObjects);

    const resourceObjectToRemove = await deliveryObjectRepository.findOneBy({
      id: request.params.id,
    });

    if (!resourceObjectToRemove) {
      return response.status(400).json({ status: 'Entrega não encontrada!' });
    }

    await deliveryObjectRepository.remove(resourceObjectToRemove);

    return response.json(resourceObjectToRemove);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const modelRepository = APPDataSource.getRepository(DeliveryObjects);

    const { id } = request.params;

    const one = await modelRepository.findOne({ where: { id: id } });

    return response.json(one);
  }
}

export { DeliveryObjectController };
