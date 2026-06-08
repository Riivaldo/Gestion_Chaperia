import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { VehiculoEntity } from './vehiculo.entity';

@Entity('clientes')
export class ClienteEntity {
  @PrimaryGeneratedColumn()
  id_cliente!: number;

  @Column()
  nombre!: string;

  @Column()
  appaterno!: string;

  @Column({ nullable: true })
  apmaterno?: string;

  @Column({ unique: true })
  ci!: string;

  @Column()
  telefono!: string;

  @Column()
  zona!: string;

  @Column({ default: 1 })
  activo!: number;

  @OneToMany(() => VehiculoEntity, (vehiculo) => vehiculo.cliente)
  vehiculos?: VehiculoEntity[];
}
