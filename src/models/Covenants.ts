import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid'; // Importando o uuid v4 e renomeando pra uuid
import { Grantor } from './Grantor';
import { ResourceObject } from './ResourceObject';

@Entity('covenants') // Do TypeORM, pois será uma entidade do banco de dados, utilizada no controller
export class Covenants {
  @PrimaryColumn()
  readonly id: string; // o readonly para não deixar quem tem informação do id mudar o valor, nesse caso o controller poderá só ler

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  year: string;

  @Column({ nullable: true })
  amendmentNumber: string;

  @Column({ nullable: true })
  agreementNumber: string;

  @Column({ nullable: true })
  processNumber: string;

  @Column({ nullable: true })
  transferAmount: string;

  @Column({ nullable: true })
  counterpartValue: string;

  @Column({ nullable: true })
  globalValue: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  balance: string;

  @ManyToMany(() => Grantor, grantor => grantor.covenantGrantors)
  covenantGrantors: Grantor[];

  @OneToMany(() => ResourceObject, resourceObjects => resourceObjects.covenants)
  resourceObjects: ResourceObject[];

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
