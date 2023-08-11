import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Objects } from '../models/Objects';
import { Nature } from '../models/Nature';
import { Model } from '../models/Model';
import { Axle } from '../models/Axle';
import { DeliveryObjects } from '../models/DeliveryObjects';
import { Resource } from '../models/Resource';
import { ResourceObject } from '../models/ResourceObject';
import { BottomToBottom } from '../models/BottomToBottom';
import { Goal } from '../models/Goal';
import { Covenants } from '../models/Covenants';
import { Grantor } from '../models/Grantor';
import { DestinationObjects } from '../models/DestinationObjects';
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
    Resource,
    ResourceObject,
    BottomToBottom,
    Covenants,
    Goal,
    Grantor,
    DestinationObjects,
  ],
  subscribers: [],
});
