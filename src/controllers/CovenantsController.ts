import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { Covenant } from '../models/Covenant';
import { CovenantGrantor } from '../models/CovenantGrantor';

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
      covenantGrantor,
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

    const covenantsRepository = APPDataSource.getRepository(Covenant);

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
    });

    await covenantsRepository.save(covenants);

    const covenantGrantorPromises = covenantGrantor.map(async element => {
      const contributionValue = element.contributionValue;
      const grantors = element.grantors;

      const convenantGrantorRepository =
        APPDataSource.getRepository(CovenantGrantor);

      const covenantGrantor = convenantGrantorRepository.create({
        contributionValue,
        covenants,
        grantors,
      });

      return convenantGrantorRepository.save(covenantGrantor);
    });

    try {
      await Promise.all(covenantGrantorPromises);
    } catch (err) {
      return response
        .status(500)
        .json({ status: 'Erro ao criar covenantGrantors', error: err });
    }
    return response.status(201).json(covenants);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const covenantsRepository = APPDataSource.getRepository(Covenant);
    const all = await covenantsRepository.find({
      relations: {
        covenantGrantor: true,
        resourceObjects: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const covenantsRepository = APPDataSource.getRepository(Covenant);
    const { id } = request.params;

    const one = await covenantsRepository.findOne({
      where: { id: id },
      relations: {
        covenantGrantor: true,
        resourceObjects: true,
      },
    });

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
      covenantGrantor,
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
        .json({ status: 'Erro de validação dos campos!', errors: err.errors });
    }

    const covenantsRepository = APPDataSource.getRepository(Covenant);

    // Atualizando os dados do convênio
    await covenantsRepository.update(
      { id },
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
      },
    );

    // Agora, vamos lidar com os covenantGrantors
    if (covenantGrantor && covenantGrantor.length > 0) {
      const covenantGrantorPromises = covenantGrantor.map(async element => {
        const contributionValue = element.contributionValue;
        const grantors = element.grantors;

        const convenantGrantorRepository =
          APPDataSource.getRepository(CovenantGrantor);

        // Aqui você pode checar se precisa substituir ou editar os covenantGrantors existentes
        if (element.id) {
          // Se element.id estiver presente, você pode atualizar o existente
          await convenantGrantorRepository.update(
            { id: element.id },
            {
              contributionValue,
              grantors,
            },
          );
        } else {
          // Caso contrário, crie um novo covenantGrantor
          const covenantGrantor = convenantGrantorRepository.create({
            contributionValue,
            covenants: { id }, // Pode ser necessário ajustar isso dependendo da estrutura de dados
            grantors,
          });
          await convenantGrantorRepository.save(covenantGrantor);
        }
      });

      try {
        await Promise.all(covenantGrantorPromises);
      } catch (err) {
        return response
          .status(500)
          .json({ status: 'Erro ao atualizar covenantGrantors', error: err });
      }
    }

    return response
      .status(201)
      .json({ status: 'Atualização concluída com sucesso!' });
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const covenantsRepository = APPDataSource.getRepository(Covenant);
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
    const covenantsRepository = APPDataSource.getRepository(Covenant);
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
