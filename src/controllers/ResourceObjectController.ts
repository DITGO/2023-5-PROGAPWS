import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { ResourceObject } from '../models/ResourceObject';

class ResourceObjectController {
  async create(request: Request, response: Response, next: NextFunction) {
    const {
      amount,
      unitaryValue,
      estimatedTotalValue,
      status,
      progress,
      processNumber,
      natureExpense,
      commitmentDate,
      acquisitionMode,
      executedValue,
      objects,
      goal,
    } = request.body;

    const schema = yup.object().shape({
      amount: yup.string(),
      unitaryValue: yup.string(),
      estimatedTotalValue: yup.string(),
      status: yup.string(),
      progress: yup.string(),
      processNumber: yup.string(),
      natureExpense: yup.string(),
      acquisitionMode: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const resourceObjectRepository =
      APPDataSource.getRepository(ResourceObject);

    const resourceObject = resourceObjectRepository.create({
      amount,
      unitaryValue,
      estimatedTotalValue,
      status,
      progress,
      processNumber,
      natureExpense,
      commitmentDate,
      executedValue,
      acquisitionMode,
      objects,
      goal,
    });
    await resourceObjectRepository.save(resourceObject);

    return response.status(201).json(resourceObject);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository =
      APPDataSource.getRepository(ResourceObject);

    const all = await resourceObjectRepository.find({
      relations: {
        objects: true,
        goal: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository =
      APPDataSource.getRepository(ResourceObject);

    const { id } = request.params;

    const one = await resourceObjectRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const {
      amount,
      unitaryValue,
      estimatedTotalValue,
      status,
      progress,
      processNumber,
      acquisitionMode,
      natureExpense,
      commitmentDate,
      executedValue,
      objects,
      goal,
    } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      amount: yup.string(),
      unitaryValue: yup.string(),
      estimatedTotalValue: yup.string(),
      status: yup.string(),
      progress: yup.string(),
      processNumber: yup.string(),
      natureExpense: yup.string(),
      acquisitionMode: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const resourceObjectRepository =
      APPDataSource.getRepository(ResourceObject);

    const resourceObject = await resourceObjectRepository.update(
      {
        id,
      },
      {
        amount,
        unitaryValue,
        estimatedTotalValue,
        status,
        progress,
        processNumber,
        natureExpense,
        acquisitionMode,
        commitmentDate,
        executedValue,
        objects,
        goal,
      },
    );

    return response.status(201).json(resourceObject);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository =
      APPDataSource.getRepository(ResourceObject);

    const resourceObjectToRemove = await resourceObjectRepository.findOneBy({
      id: request.params.id,
    });

    if (!resourceObjectToRemove) {
      return response
        .status(400)
        .json({ status: 'Objetos do recurso não encontrado!' });
    }

    const deleteResponse = await resourceObjectRepository.softDelete(
      resourceObjectToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response
        .status(400)
        .json({ status: 'Objetos do recurso não excluido!' });
    }

    return response.json(resourceObjectToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository =
      APPDataSource.getRepository(ResourceObject);

    const resourceObjectToRestore = await resourceObjectRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!resourceObjectToRestore) {
      return response
        .status(400)
        .json({ status: 'Objetos do recurso não encontrado!' });
    }

    const restoreResponse = await resourceObjectRepository.restore(
      resourceObjectToRestore.id,
    );

    if (restoreResponse.affected) {
      return response
        .status(200)
        .json({ status: 'Objetos do recurso recuperado!' });
    }

    return response.json(resourceObjectRepository);
  }
}

export { ResourceObjectController };
