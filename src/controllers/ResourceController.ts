import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Resource } from '../models/Resource';

class ResourceController {
  async create(request: Request, response: Response, next: NextFunction) {
    const {
      grantor,
      source,
      type,
      natureExpense,
      resourceNumber,
      resourceYear,
      goal,
      totalValue,
      balance,
      axle,
    } = request.body;

    const schema = yup.object().shape({
      source: yup.string().required(),
      type: yup.string().required(),
      resourceYear: yup.string(),
      goal: yup.string(),
      totalValue: yup.string(),
      balance: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const resourceObjectRepository = APPDataSource.getRepository(Resource);

    const resource = resourceObjectRepository.create({
      grantor,
      source,
      type,
      natureExpense,
      resourceNumber,
      resourceYear,
      goal,
      totalValue,
      balance,
      axle,
    });

    if (axle) {
      resource.axle = axle;
    }

    // Verificar se grantor foi fornecido
    if (grantor) {
      resource.grantor = grantor;
    }

    if (resourceNumber) {
      resource.resourceNumber = resourceNumber;
    }

    if (goal) {
      resource.goal = goal;
    }

    await resourceObjectRepository.save(resource);

    return response.status(201).json(resource);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository = APPDataSource.getRepository(Resource);

    const all = await resourceObjectRepository.find({
      relations: {
        axle: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository = APPDataSource.getRepository(Resource);

    const { id } = request.params;

    const one = await resourceObjectRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const {
      grantor,
      source,
      type,
      natureExpense,
      resourceNumber,
      resourceYear,
      goal,
      totalValue,
      balance,
      axle,
    } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      source: yup.string().required(),
      type: yup.string().required(),
      resourceNumber: yup.string().required(),
      resourceYear: yup.string(),
      goal: yup.string(),
      totalValue: yup.string(),
      balance: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const resourceObjectRepository = APPDataSource.getRepository(Resource);

    const resource = await resourceObjectRepository.update(
      {
        id,
      },
      {
        grantor,
        source,
        type,
        natureExpense,
        resourceNumber,
        resourceYear,
        goal,
        totalValue,
        balance,
        axle,
      },
    );

    return response.status(201).json(resource);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository = APPDataSource.getRepository(Resource);

    const resourceToRemove = await resourceObjectRepository.findOneBy({
      id: request.params.id,
    });

    if (!resourceToRemove) {
      return response.status(400).json({ status: 'Recurso não encontrado!' });
    }

    const deleteResponse = await resourceObjectRepository.softDelete(
      resourceToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response.status(400).json({ status: 'Recurso não excluido!' });
    }

    return response.json(resourceToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository = APPDataSource.getRepository(Resource);

    const resourceToRestore = await resourceObjectRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!resourceToRestore) {
      return response.status(400).json({ status: 'Recurso não encontrado!' });
    }

    const restoreResponse = await resourceObjectRepository.restore(
      resourceToRestore.id,
    );

    if (restoreResponse.affected) {
      return response.status(200).json({ status: 'Recurso recuperado!' });
    }

    return response.json(resourceObjectRepository);
  }

  async token(request: Request, response: Response, next: NextFunction) {
    const id = 1;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 43200,
    });

    return response.json({ auth: true, token });
  }
}

export { ResourceController };
