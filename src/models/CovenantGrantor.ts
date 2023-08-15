import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column } from 'typeorm';
import { Covenants } from './Covenants';
import { Grantor } from './Grantor';

@Entity('covenant_grantor') // Nome da tabela de junção
export class CovenantGrantor {
  @PrimaryColumn()
  readonly id: string; // o readonly para não deixar quem tem informação do id mudar o valor, nesse caso o controller poderá só ler

  @Column({ nullable: true })
  value: string;

  @ManyToOne(() => Covenants, covenant => covenant.covenantGrantors)
  @JoinColumn({ name: 'covenantId' })
  covenant: Covenants;

  @ManyToOne(() => Grantor, grantor => grantor.covenantGrantors)
  @JoinColumn({ name: 'grantorId' })
  grantor: Grantor;
}
