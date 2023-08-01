import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid'; // Importando o uuid v4 e renomeando pra uuid

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

  @Column()
  natureExpense: string;

  @Column({
    nullable: true,
  })
  resourceNumber: string;

  @Column()
  resourceYear: string;

  @Column({
    nullable: true,
  })
  goal: string;

  @Column()
  totalValue: string;

  @Column()
  balance: string;

  // @ManyToOne(() => Axle, axle => axle.resources, {
  //   eager: true,
  //   nullable: true,
  // })
  // axle: Axle;

  // @OneToMany(() => Destination, Destination => Destination.resources)
  // destination: Destination[];

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
