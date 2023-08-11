import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { DestinationObjects } from '../models/DestinationObjects';

class DestinationObjectsControllers {
  async create(request: Request, response: Response, next: NextFunction) {
    const { unitId, expectedAmount, resourceObjects } = request.body;

    const schema = yup.object().shape({
      unitId: yup.number().nullable(),
      expectedAmount: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const deliveryObjectRepository =
      APPDataSource.getRepository(DestinationObjects);

    const deliveryObject = deliveryObjectRepository.create({
      unitId,
      expectedAmount,
      resourceObjects,
    });

    await deliveryObjectRepository.save(deliveryObject);

    return response.status(201).json(deliveryObject);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const deliveryObjectRepository =
      APPDataSource.getRepository(DestinationObjects);

    const all = await deliveryObjectRepository.find({
      relations: {
        resourceObjects: true,
      },
    });

    return response.json(all);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { unitId, expectedAmount, resourceObjects } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      unitId: yup.number().nullable(),
      expectedAmount: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!', errors: err.errors });
    }

    const deliveryObjectRepository =
      APPDataSource.getRepository(DestinationObjects);

    const deliveryObject = await deliveryObjectRepository.update(
      {
        id,
      },
      {
        unitId,
        expectedAmount,
        resourceObjects,
      },
    );

    return response.status(201).json(deliveryObject);
  }

  // EXCLUÇÃO PERMANETE
  async remove(request: Request, response: Response, next: NextFunction) {
    const deliveryObjectRepository =
      APPDataSource.getRepository(DestinationObjects);

    const resourceObjectToRemove = await deliveryObjectRepository.findOneBy({
      id: request.params.id,
    });

    if (!resourceObjectToRemove) {
      return response
        .status(400)
        .json({ status: 'Destination of Objects não encontrada!' });
    }

    await deliveryObjectRepository.remove(resourceObjectToRemove);

    return response.json(resourceObjectToRemove);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const modelRepository = APPDataSource.getRepository(DestinationObjects);

    const { id } = request.params;

    const one = await modelRepository.findOne({ where: { id: id } });

    return response.json(one);
  }
}

export { DestinationObjectsControllers };
