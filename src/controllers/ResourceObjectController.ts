import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { ResourceObject } from '../models/ResourceObject';
import { DestinationObjects } from '../models/DestinationObjects';
import { DeepPartial } from 'typeorm';

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
      destinationObjects,
      stateTreasury,
      stateAmendment,
      covenants,
      objects,
      goal,
    } = request.body;

    const schema = yup.object().shape({
      amount: yup.string().nullable(),
      unitaryValue: yup.string().nullable(),
      estimatedTotalValue: yup.string().nullable(),
      status: yup.string().nullable(),
      progress: yup.string().nullable(),
      processNumber: yup.string().nullable(),
      natureExpense: yup.string().nullable(),
      acquisitionMode: yup.string().nullable(),
      commitmentDate: yup.string().nullable(),
      executedValue: yup.string().nullable(),
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
      stateAmendment,
      stateTreasury,
      covenants,
      objects,
      goal,
    });

    const savedResourceObject = await resourceObjectRepository.save(
      resourceObject,
    );

    const destinationObjectsPromises = destinationObjects.map(async element => {
      const unitId = element.unitId;
      const expectedQuantity = element.expectedQuantity;

      const destinationRepository =
        APPDataSource.getRepository(DestinationObjects);

      // Cria um objeto de recurso parcial contendo apenas o ID do objeto de recurso
      const resourceObjectPartial: DeepPartial<ResourceObject> = {
        id: savedResourceObject.id,
      };

      const destinationObject = destinationRepository.create({
        unitId,
        expectedQuantity,
        resourceObjects: resourceObjectPartial, // Associa o objeto de recurso parcial ao campo
      });

      return destinationRepository.save(destinationObject);
    });

    try {
      await Promise.all(destinationObjectsPromises);
    } catch (err) {
      return response
        .status(500)
        .json({ status: 'Erro ao criar destinações do objeto', error: err });
    }

    return response.status(201).json(resourceObject);
  }
  async all(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository =
      APPDataSource.getRepository(ResourceObject);

    const all = await resourceObjectRepository.find({
      relations: {
        objects: true,
        goal: true,
        covenants: true,
        stateTreasury: true,
        destinationObjects: true,
        stateAmendment: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository =
      APPDataSource.getRepository(ResourceObject);

    const { id } = request.params;

    const one = await resourceObjectRepository.findOne({
      where: { id: id },
      relations: {
        objects: true,
        goal: true,
        covenants: true,
        destinationObjects: true,
        stateAmendment: true,
      },
    });

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
      destinationObjects,
      stateAmendment,
      stateTreasury,
      covenants,
      objects,
      goal,
    } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      amount: yup.string().nullable(),
      unitaryValue: yup.string().nullable(),
      estimatedTotalValue: yup.string().nullable(),
      status: yup.string().nullable(),
      progress: yup.string().nullable(),
      processNumber: yup.string().nullable(),
      natureExpense: yup.string().nullable(),
      acquisitionMode: yup.string().nullable(),
      commitmentDate: yup.string().nullable(),
      executedValue: yup.string().nullable(),
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

    // Atualizando os campos do resourceObject
    await resourceObjectRepository.update(
      { id },
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
        stateAmendment,
        stateTreasury,
        covenants,
        objects,
        goal,
      },
    );

    // Lidando com a atualização dos destinationObjects
    if (destinationObjects && destinationObjects.length > 0) {
      const destinationObjectsPromises = destinationObjects.map(
        async element => {
          const unitId = element.unitId;
          const expectedQuantity = element.expectedQuantity;

          const destinationRepository =
            APPDataSource.getRepository(DestinationObjects);

          // Aqui você pode checar se precisa substituir ou editar os destinationObjects existentes
          if (element.id) {
            // Se destinationObjectId estiver presente, você pode atualizar o existente
            await destinationRepository.update(
              { id: element.id },
              {
                unitId,
                expectedQuantity,
              },
            );
          } else {
            // Caso contrário, crie um novo destinationObject
            const resourceObjectPartial: DeepPartial<ResourceObject> = {
              id,
            };

            const destinationObject = destinationRepository.create({
              unitId,
              expectedQuantity,
              resourceObjects: resourceObjectPartial,
            });

            await destinationRepository.save(destinationObject);
          }
        },
      );

      try {
        await Promise.all(destinationObjectsPromises);
      } catch (err) {
        return response
          .status(500)
          .json({ status: 'Erro ao atualizar destinationObjects', error: err });
      }
    }

    return response
      .status(201)
      .json({ status: 'Atualização concluída com sucesso!' });
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
