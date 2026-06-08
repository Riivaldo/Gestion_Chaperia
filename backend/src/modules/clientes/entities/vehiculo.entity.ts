import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClienteEntity } from './cliente.entity';

@Entity('vehiculos')
export class VehiculoEntity {
  @PrimaryGeneratedColumn()
  id_vehiculo!: number;

  @Column()
  id_cliente!: number;

  @Column({ unique: true })
  placa!: string;

  @Column()
  marca!: string;

  @Column()
  modelo!: string;

  @Column()
  color!: string;

  @Column({ default: 1 })
  activo!: number;

  @Column({ nullable: true })
  anio!: number;

  @ManyToOne(() => ClienteEntity, (cliente) => cliente.vehiculos)
  @JoinColumn({ name: 'id_cliente' })
  cliente?: ClienteEntity;
}
