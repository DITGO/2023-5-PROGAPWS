import {
  Entity,
  ManyToOne,
  PrimaryColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Covenant } from './Covenant';
import { Grantor } from './Grantor';
import { v4 as uuid } from 'uuid'; // Importando o uuid v4 e renomeando pra uuid

@Entity('covenantGrantor') // Nome da tabela de junção
export class CovenantGrantor {
  @PrimaryColumn()
  readonly id: string; // o readonly para não deixar quem tem informação do id mudar o valor, nesse caso o controller poderá só ler

  @Column()
  contributionValue: string;

  @ManyToOne(() => Covenant, covenant => covenant.covenantGrantor, {
    eager: true,
    nullable: false,
  })
  covenants: Covenant;

  @ManyToOne(() => Grantor, grantor => grantor.covenantGrantor, {
    eager: true,
    nullable: false,
  })
  grantors: Grantor;

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
