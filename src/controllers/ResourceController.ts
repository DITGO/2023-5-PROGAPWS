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
      typeExpense,
      resourceNumber,
      resourceYear,
      processNumber,
      commitmentDate,
      deliveryDate,
      settlementDate,
      axle,
    } = request.body;

    const schema = yup.object().shape({
      source: yup.string().required(),
      type: yup.string().required(),
      typeExpense: yup.string().required(),
      resourceYear: yup.string(),
      processNumber: yup.string(),
      commitmentDate: yup.string(),
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

    const resourceObjectRepository = APPDataSource.getRepository(Resource);

    const resource = resourceObjectRepository.create({
      grantor,
      source,
      type,
      typeExpense,
      resourceNumber,
      resourceYear,
      processNumber,
      commitmentDate,
      deliveryDate,
      settlementDate,
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
      typeExpense,
      resourceNumber,
      resourceYear,
      processNumber,
      commitmentDate,
      deliveryDate,
      settlementDate,
      axle,
    } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      source: yup.string().required(),
      type: yup.string().required(),
      typeExpense: yup.string().required(),
      resourceYear: yup.string(),
      processNumber: yup.string(),
      commitmentDate: yup.string(),
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

    const resourceObjectRepository = APPDataSource.getRepository(Resource);

    const resource = await resourceObjectRepository.update(
      {
        id,
      },
      {
        grantor,
        source,
        type,
        typeExpense,
        resourceNumber,
        resourceYear,
        processNumber,
        commitmentDate,
        deliveryDate,
        settlementDate,
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

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository = APPDataSource.getRepository(Resource);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceObjectRepository
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

export { ResourceController };
