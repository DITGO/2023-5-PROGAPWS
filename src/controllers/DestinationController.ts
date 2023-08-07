import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { Destination } from '../models/Destination';

class DestinationController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { unitId, subUnitId, resourceObjects } = request.body;

    const schema = yup.object().shape({
      unitId: yup.number().required(),
      subUnitId: yup.string(),
    });
    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const destinationObjectRepository =
      APPDataSource.getRepository(Destination);

    const destination = destinationObjectRepository.create({
      unitId,
      subUnitId,
      resourceObjects,
    });
    await destinationObjectRepository.save(destination);

    return response.status(201).json(destination);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const destinationObjectRepository =
      APPDataSource.getRepository(Destination);

    const all = await destinationObjectRepository.find({
      relations: {
        resourceObjects: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const destinationObjectRepository =
      APPDataSource.getRepository(Destination);

    const { id } = request.params;

    const one = await destinationObjectRepository.findOne({
      where: { id: id },
    });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { unitId, subUnitId, resourceObjects } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      unitId: yup.number().required(),
      subUnitId: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const destinationObjectRepository =
      APPDataSource.getRepository(Destination);

    const destination = await destinationObjectRepository.update(
      {
        id,
      },
      {
        unitId,
        subUnitId,
        resourceObjects,
      },
    );

    return response.status(201).json(destination);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const destinationObjectRepository =
      APPDataSource.getRepository(Destination);

    const destinationToRemove = await destinationObjectRepository.findOneBy({
      id: request.params.id,
    });

    if (!destinationToRemove) {
      return response
        .status(400)
        .json({ status: 'Destinação não encontrado!' });
    }

    const deleteResponse = await destinationObjectRepository.softDelete(
      destinationToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response.status(400).json({ status: 'Destinação não excluido!' });
    }

    return response.json(destinationToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const destinationObjectRepository =
      APPDataSource.getRepository(Destination);

    const destinationToRestore = await destinationObjectRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!destinationToRestore) {
      return response
        .status(400)
        .json({ status: 'Destinação não encontrado!' });
    }

    const restoreResponse = await destinationObjectRepository.restore(
      destinationToRestore.id,
    );

    if (restoreResponse.affected) {
      return response.status(200).json({ status: 'Destinação recuperado!' });
    }

    return response.json(destinationObjectRepository);
  }
}

export { DestinationController };
