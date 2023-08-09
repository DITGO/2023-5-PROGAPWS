import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { DeliveryObjects } from '../models/DeliveryObjects';

class DeliveryObjectController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { unitId, amount, deliveryDate, settlementDate, resourceObjects } =
      request.body;

    const schema = yup.object().shape({
      unitId: yup.number(),
      amount: yup.string(),
      deliveryDate: yup.string(),
      settlementDate: yup.string(),
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
      unitId,
      amount,
      deliveryDate,
      settlementDate,
      resourceObjects,
    });

    await deliveryObjectRepository.save(deliveryObject);

    return response.status(201).json(deliveryObject);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const deliveryObjectRepository =
      APPDataSource.getRepository(DeliveryObjects);

    const all = await deliveryObjectRepository.find({
      relations: {
        resourceObjects: true,
      },
    });

    return response.json(all);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { unitId, amount, deliveryDate, settlementDate, resourceObjects } =
      request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      unitId: yup.number(),
      amount: yup.string(),
      deliveryDate: yup.string(),
      settlementDate: yup.string(),
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

    const deliveryObject = await deliveryObjectRepository.update(
      {
        id,
      },
      {
        unitId,
        amount,
        deliveryDate,
        settlementDate,
        resourceObjects,
      },
    );

    return response.status(201).json(deliveryObject);
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
