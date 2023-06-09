import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Objects } from '../models/Objects';
import { Nature } from '../models/Nature';
import { Model } from '../models/Model';
import { Axle } from '../models/Axle';
import { DeliveryObjects } from '../models/DeliveryObjects';
import { Destination } from '../models/Destination';
import { Resource } from '../models/Resource';
import { ResourceObject } from '../models/ResourceObject';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const APPDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [
    Objects,
    Nature,
    Model,
    Axle,
    DeliveryObjects,
    Destination,
    Resource,
    ResourceObject,
  ],
  subscribers: [],
});
