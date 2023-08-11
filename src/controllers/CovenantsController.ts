import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { Covenants } from '../models/Covenants';

class CovenantsController {
  async create(request: Request, response: Response, next: NextFunction) {
    const {
      source,
      year,
      amendmentNumber,
      agreementNumber,
      processNumber,
      transferAmount,
      counterpartValue,
      globalValue,
      description,
      balance,
      grantor,
    } = request.body;

    const schema = yup.object().shape({
      source: yup.string().nullable(),
      year: yup.string().nullable(),
      amendmentNumber: yup.string().nullable(),
      agreementNumber: yup.string().nullable(),
      processNumber: yup.string().nullable(),
      transferAmount: yup.string().nullable(),
      counterpartValue: yup.string().nullable(),
      globalValue: yup.string().nullable(),
      description: yup.string().nullable(),
      balance: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!', errors: err.errors });
    }

    const covenantsRepository = APPDataSource.getRepository(Covenants);

    const covenants = covenantsRepository.create({
      source,
      year,
      amendmentNumber,
      agreementNumber,
      processNumber,
      transferAmount,
      counterpartValue,
      globalValue,
      description,
      balance,
      grantor,
    });

    await covenantsRepository.save(covenants);

    return response.status(201).json(covenants);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const covenantsRepository = APPDataSource.getRepository(Covenants);
    const all = await covenantsRepository.find({
      relations: {
        grantor: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const covenantsRepository = APPDataSource.getRepository(Covenants);
    const { id } = request.params;

    const one = await covenantsRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const {
      source,
      year,
      amendmentNumber,
      agreementNumber,
      processNumber,
      transferAmount,
      counterpartValue,
      globalValue,
      description,
      balance,
      grantor,
    } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      source: yup.string().nullable(),
      year: yup.string().nullable(),
      amendmentNumber: yup.string().nullable(),
      agreementNumber: yup.string().nullable(),
      processNumber: yup.string().nullable(),
      transferAmount: yup.string().nullable(),
      counterpartValue: yup.string().nullable(),
      globalValue: yup.string().nullable(),
      description: yup.string().nullable(),
      balance: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const covenantsRepository = APPDataSource.getRepository(Covenants);
    const covenants = await covenantsRepository.update(
      {
        id,
      },
      {
        source,
        year,
        amendmentNumber,
        agreementNumber,
        processNumber,
        transferAmount,
        counterpartValue,
        globalValue,
        description,
        balance,
        grantor,
      },
    );

    return response.status(201).json(covenants);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const covenantsRepository = APPDataSource.getRepository(Covenants);
    const covenantsToRemove = await covenantsRepository.findOneBy({
      id: request.params.id,
    });

    if (!covenantsToRemove) {
      return response.status(400).json({ status: 'Covenants não encontrado!' });
    }

    const deleteResponse = await covenantsRepository.softDelete(
      covenantsToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response.status(400).json({ status: 'Covenants não excluido!' });
    }

    return response.json(covenantsToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const covenantsRepository = APPDataSource.getRepository(Covenants);
    const covenantsToRestore = await covenantsRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!covenantsToRestore) {
      return response.status(400).json({ status: 'Covenantsnão encontrado!' });
    }

    const restoreResponse = await covenantsRepository.restore(
      covenantsToRestore.id,
    );

    if (restoreResponse.affected) {
      return response.status(200).json({ status: 'Covenants recuperado!' });
    }

    return response.json(covenantsRepository);
  }
}

export { CovenantsController };
