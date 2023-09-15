import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid'; // Importando o uuid v4 e renomeando pra uuid
import { Objects } from './Objects';
import { Goal } from './Goal';
import { DeliveryObjects } from './DeliveryObjects';
import { Covenant } from './Covenant';
import { DestinationObjects } from './DestinationObjects';
import { StateAmendment } from './StateAmendment';
import { StateTreasury } from './stateTreasury';
import { Fdd } from './Fdd';

@Entity('resourceObjects') // Do TypeORM, pois será uma entidade do banco de dados, utilizada no controller
export class ResourceObject {
  @PrimaryColumn()
  readonly id: string; // o readonly para não deixar quem tem informação do id mudar o valor, nesse caso o controller poderá só ler

  @Column({ nullable: true })
  amount: string;

  @Column({ nullable: true })
  unitaryValue: string;

  @Column({ nullable: true })
  estimatedTotalValue: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  progress: string;

  @Column({ nullable: true })
  processNumber: string;

  @Column({ nullable: true })
  natureExpense: string;

  @Column({ nullable: true })
  acquisitionMode: string;

  @Column({
    nullable: true,
  })
  executedValue: string;

  @Column({
    nullable: true,
  })
  commitmentDate: string;

  @ManyToOne(
    () => StateAmendment,
    stateAmendment => stateAmendment.resourceObjects,
    {
      eager: true,
      nullable: true,
    },
  )
  stateAmendment: StateAmendment;

  @ManyToOne(() => Covenant, covenants => covenants.resourceObjects, {
    eager: true,
    nullable: true,
  })
  covenants: Covenant;

  @ManyToOne(() => Goal, goal => goal.resourceObjects, {
    eager: true,
    nullable: true,
  })
  goal: Goal;

  @ManyToOne(
    () => StateTreasury,
    stateTreasury => stateTreasury.resourceObjects,
    {
      eager: true,
      nullable: true,
    },
  )
  stateTreasury: StateTreasury;

  @ManyToOne(() => Fdd, fdd => fdd.resourceObjects, {
    eager: true,
    nullable: true,
  })
  fdd: Fdd;

  @ManyToOne(() => Objects, objetc => objetc.resourceObjects, {
    eager: true,
    nullable: false,
  })
  objects: Objects;

  @OneToMany(
    () => DeliveryObjects,
    deliveryObjects => deliveryObjects.resourceObjects,
  )
  deliveryObjects: DeliveryObjects[];

  @OneToMany(
    () => DestinationObjects,
    destinationObjects => destinationObjects.resourceObjects,
  )
  destinationObjects: DestinationObjects[];

  @DeleteDateColumn()
  deleted_at: Date;

  @CreateDateColumn() // Para já capturar a data e fazer a formatação
  created_at: Date;

  @UpdateDateColumn() // Para já capturar a data e fazer a formatação
  update_at: Date;

  /*
      A geração do uuID automático não será por meio do SGBD, e sim aqui pelo código
      Utilizando a bilioteca: yarn add uuid
      Tipos da biblioteca uuid: yarn add @types/uuid -D
  */
  constructor() {
    // Se esse ID não existir, gerar um id
    if (!this.id) {
      this.id = uuid();
    }
  }
}
