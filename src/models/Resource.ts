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
import { Axle } from './Axle';
import { Destination } from './Destination';

@Entity('resources') // Do TypeORM, pois será uma entidade do banco de dados, utilizada no controller
export class Resource {
  @PrimaryColumn()
  readonly id: string; // o readonly para não deixar quem tem informação do id mudar o valor, nesse caso o controller poderá só ler

  @Column({
    nullable: true,
  })
  grantor: string;

  @Column()
  source: string;

  @Column()
  type: string;

  @Column({
    nullable: true,
  })
  typeExpense: string;

  @Column({
    nullable: true,
  })
  resourceNumber: string;

  @Column()
  resourceYear: string;

  @Column()
  processNumber: string;

  @Column()
  commitmentDate: string;

  @Column()
  deliveryDate: string;

  @Column()
  settlementDate: string;

  @ManyToOne(() => Axle, axle => axle.resources, {
    eager: true,
    nullable: true,
  })
  axle: Axle;

  @OneToMany(() => Destination, Destination => Destination.resources)
  destination: Destination[];

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
