import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { ManyToOne } from 'typeorm/browser';

@Entity('log_acceso')
export class LogAccesoEntity {
  @PrimaryGeneratedColumn()
  id_log!: number;

  @Column()
  id_usuario!: number;

  @ManyToOne(() => UsuarioEntity)
  @JoinColumn({ name: 'id_usuario' })
  usuario?: UsuarioEntity;

  @Column()
  ip!: string;

  @Column()
  evento!: string;

  @Column()
  browser!: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_hora!: Date;
}
