import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { Grantor } from '../models/Grantor';

class GrantorController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { name } = request.body;
    const schema = yup.object().shape({
      name: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const grantorRepository = APPDataSource.getRepository(Grantor);
    const grantorAlreadyExists = await grantorRepository.findOne({
      where: { name: name },
    });

    if (grantorAlreadyExists) {
      return response.status(400).json({ status: 'Grantor já existe!' });
    }

    const grantor = grantorRepository.create({
      name,
    });

    await grantorRepository.save(grantor);

    return response.status(201).json(grantor);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const grantorRepository = APPDataSource.getRepository(Grantor);

    const all = await grantorRepository.find({
      relations: {
        covenantGrantor: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const grantorRepository = APPDataSource.getRepository(Grantor);

    const { id } = request.params;

    const one = await grantorRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, contributionValue } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const grantorRepository = APPDataSource.getRepository(Grantor);

    const grantor = await grantorRepository.update(
      {
        id,
      },
      {
        name,
      },
    );

    return response.status(201).json(grantor);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const grantorRepository = APPDataSource.getRepository(Grantor);

    const grantorToRemove = await grantorRepository.findOneBy({
      id: request.params.id,
    });

    if (!grantorToRemove) {
      return response
        .status(400)
        .json({ status: 'Concedente não encontrada!' });
    }

    const deleteResponse = await grantorRepository.softDelete(
      grantorToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response
        .status(400)
        .json({ status: 'Concedente não foi excluido!' });
    }

    return response.json(grantorToRemove);
  }
}
export { GrantorController };
