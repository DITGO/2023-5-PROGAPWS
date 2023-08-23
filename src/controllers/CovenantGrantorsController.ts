import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { CovenantGrantor } from '../models/CovenantGrantor';

class CovenantGrantorsController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { contributionValue, covenants, grantors } = request.body;

    const convenantGrantorRepository =
      APPDataSource.getRepository(CovenantGrantor);

    const covenantGrantor = convenantGrantorRepository.create({
      contributionValue,
      covenants,
      grantors,
    });

    await convenantGrantorRepository.save(covenantGrantor);

    return response.status(201).json(covenantGrantor);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const convenantGrantorRepository =
      APPDataSource.getRepository(CovenantGrantor);

    const all = await convenantGrantorRepository.find({
      relations: {
        covenants: true,
        grantors: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const convenantGrantorRepository =
      APPDataSource.getRepository(CovenantGrantor);

    const { id } = request.params;

    const one = await convenantGrantorRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { contributionValue, covenants, grantors } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      contributionValue: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const convenantGrantorRepository =
      APPDataSource.getRepository(CovenantGrantor);

    const covenantGrantor = await convenantGrantorRepository.update(
      {
        id,
      },
      {
        contributionValue,
        covenants,
        grantors,
      },
    );

    return response.status(201).json(covenantGrantor);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const convenantGrantorRepository =
      APPDataSource.getRepository(CovenantGrantor);

    const covenantGrantorToRemove = await convenantGrantorRepository.findOneBy({
      id: request.params.id,
    });

    if (!covenantGrantorToRemove) {
      return response
        .status(400)
        .json({ status: 'convênio/concedente não encontrada!' });
    }

    const deleteResponse = await convenantGrantorRepository.delete(
      covenantGrantorToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response
        .status(400)
        .json({ status: 'convênio/concedente não foi excluido!' });
    }

    return response.json(covenantGrantorToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const convenantGrantorRepository =
      APPDataSource.getRepository(CovenantGrantor);

    const covenantGrantorToRestore = await convenantGrantorRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!covenantGrantorToRestore) {
      return response
        .status(400)
        .json({ status: 'covenantGrantor não encontrado!' });
    }

    const restoreResponse = await convenantGrantorRepository.restore(
      covenantGrantorToRestore.id,
    );

    if (restoreResponse.affected) {
      return response
        .status(200)
        .json({ status: 'covenantGrantor recuperado!' });
    }

    return response.json(convenantGrantorRepository);
  }
}

export { CovenantGrantorsController };
