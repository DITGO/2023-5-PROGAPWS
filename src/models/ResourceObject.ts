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
import { Destination } from './Destination';

@Entity('resourceObjects') // Do TypeORM, pois será uma entidade do banco de dados, utilizada no controller
export class ResourceObject {
  @PrimaryColumn()
  readonly id: string; // o readonly para não deixar quem tem informação do id mudar o valor, nesse caso o controller poderá só ler

  @Column() // Poderia passar o nome da coluna: @Column("name"), mas o atributo já está com mesmo nome
  amount: string;

  @Column()
  unitaryValue: string;

  @Column()
  totalValue: string;

  @Column()
  status: string;

  @Column()
  progress: string;

  @Column()
  processNumber: string;

  @Column()
  natureExpense: string;

  @Column()
  estimatedValue: string;

  @Column({
    nullable: true,
  })
  executedValue: string;

  @Column({
    nullable: true,
  })
  dateCommitted: string;

  @Column({
    nullable: true,
  })
  deliveryDate: string;

  @Column({
    nullable: true,
  })
  settlementDate: string;

  @ManyToOne(() => Goal, goal => goal.resourceObjects, {
    eager: true,
    nullable: false,
  })
  goal: Goal;

  @ManyToOne(() => Objects, objetc => objetc.resourceObjects, {
    eager: true,
    nullable: false,
  })
  objects: Objects;

  @OneToMany(() => Destination, destination => destination.resourceObjects)
  destinations: Destination[];

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
