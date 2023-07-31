import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid'; // Importando o uuid v4 e renomeando pra uuid
import { Resource } from './Resource';
import { BottomToBottom } from './bottomToBottom';

@Entity('axles')
export class Axle {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  // @OneToMany(() => Resource, resource => resource.axle)
  // resources: Resource[];

  @OneToMany(() => BottomToBottom, bottomToBottom => bottomToBottom.axle)
  bottomToBottom: BottomToBottom[];

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
