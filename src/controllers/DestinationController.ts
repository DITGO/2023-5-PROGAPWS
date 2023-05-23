import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Destination } from '../models/Destination';

class DestinationController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { unitId, subUnitId, resources } = request.body;

    const schema = yup.object().shape({
      unitId: yup.string().required(),
      subUnitId: yup.string().required(),
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

    const destinationAlreadyExists = await destinationObjectRepository.findOne({
      where: { unitId: unitId },
    });

    if (destinationAlreadyExists) {
      return response.status(400).json({ status: 'Recurso já existe!' });
    }

    const destination = destinationObjectRepository.create({
      unitId,
      subUnitId,
      resources,
    });

    await destinationObjectRepository.save(destination);

    return response.status(201).json(destination);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const destinationObjectRepository =
      APPDataSource.getRepository(Destination);

    const all = await destinationObjectRepository.find({
      relations: {
        resources: true,
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
    const { unitId, subUnitId, resources } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      unitId: yup.string().required(),
      subUnitId: yup.string().required(),
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
        resources,
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
      return response.status(400).json({ status: 'Recurso não encontrado!' });
    }

    const deleteResponse = await destinationObjectRepository.softDelete(
      destinationToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response.status(400).json({ status: 'Recurso não excluido!' });
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
      return response.status(400).json({ status: 'Recurso não encontrado!' });
    }

    const restoreResponse = await destinationObjectRepository.restore(
      destinationToRestore.id,
    );

    if (restoreResponse.affected) {
      return response.status(200).json({ status: 'Recurso recuperado!' });
    }

    return response.json(destinationObjectRepository);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const destinationObjectRepository =
      APPDataSource.getRepository(Destination);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await destinationObjectRepository
      .createQueryBuilder('object')
      .take(parseInt(perPage.toString()))
      .skip(skip)
      .addOrderBy(column.toString(), 'ASC')
      .getMany();

    return response.json(all);
  }

  async token(request: Request, response: Response, next: NextFunction) {
    const id = 1;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 43200,
    });

    return response.json({ auth: true, token });
  }
}

export { DestinationController };
