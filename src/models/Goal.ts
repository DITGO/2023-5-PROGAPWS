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
import { BottomToBottom } from './BottomToBottom';
import { ResourceObject } from './ResourceObject';

@Entity('goal')
export class Goal {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  description: string;

  @Column()
  predictedValue: string;

  @Column()
  balance: string;

  @ManyToOne(() => BottomToBottom, bottomToBottom => bottomToBottom.goal, {
    eager: true,
  })
  bottomToBottom: BottomToBottom;

  @OneToMany(() => ResourceObject, resourceObject => resourceObject.goal)
  resourcesObjects: ResourceObject[];

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
