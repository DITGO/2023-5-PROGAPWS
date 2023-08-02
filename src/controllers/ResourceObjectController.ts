import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { ResourceObject } from '../models/ResourceObject';

class ResourceObjectController {
  async create(request: Request, response: Response, next: NextFunction) {
    const {
      amount,
      unitaryValue,
      totalValue,
      status,
      progress,
      processNumber,
      natureExpense,
      estimatedValue,
      dateCommitted,
      executedValue,
      deliveryDate,
      settlementDate,
      objects,
      goal,
    } = request.body;

    const schema = yup.object().shape({
      amount: yup.string().required(),
      unitaryValue: yup.string().required(),
      totalValue: yup.string().required(),
      status: yup.string().required(),
      progress: yup.string().required(),
      processNumber: yup.string().required(),
      natureExpense: yup.string().required(),
      estimatedValue: yup.string().required(),
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
      totalValue,
      status,
      progress,
      processNumber,
      natureExpense,
      estimatedValue,
      dateCommitted,
      executedValue,
      deliveryDate,
      settlementDate,
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
      totalValue,
      status,
      progress,
      processNumber,
      natureExpense,
      estimatedValue,
      dateCommitted,
      executedValue,
      deliveryDate,
      settlementDate,
      objects,
      goal,
    } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      amount: yup.string().required(),
      unitaryValue: yup.string().required(),
      totalValue: yup.string().required(),
      status: yup.string().required(),
      progress: yup.string().required(),
      processNumber: yup.string().required(),
      natureExpense: yup.string().required(),
      estimatedValue: yup.string().required(),
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
        totalValue,
        status,
        progress,
        processNumber,
        natureExpense,
        estimatedValue,
        dateCommitted,
        executedValue,
        deliveryDate,
        settlementDate,
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

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository =
      APPDataSource.getRepository(ResourceObject);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceObjectRepository
      .createQueryBuilder('resourceobject')
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

export { ResourceObjectController };
