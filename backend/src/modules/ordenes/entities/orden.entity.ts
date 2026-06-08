import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VehiculoEntity } from '../../clientes/entities/vehiculo.entity';
import { UsuarioEntity } from '../../auth/entities/usuario.entity';

@Entity('ordenes_trabajo')
export class OrdenEntity {
  @PrimaryGeneratedColumn()
  id_orden!: number;

  @Column()
  id_vehiculo!: number;

  @Column()
  id_mecanico!: number;

  @Column({ type: 'text' })
  descripcion_falla!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto_total!: number;

  @Column({ default: 'en_proceso' })
  estado!: string; // 'en_proceso' o 'terminado'

  @CreateDateColumn({ type: 'timestamp' })
  fecha_ingreso!: Date;

  // CONEXIONES/JOINS AUTOMÁTICOS
  @ManyToOne(() => VehiculoEntity)
  @JoinColumn({ name: 'id_vehiculo' })
  vehiculo?: VehiculoEntity;

  @ManyToOne(() => UsuarioEntity)
  @JoinColumn({ name: 'id_mecanico' })
  mecanico?: UsuarioEntity;
}
