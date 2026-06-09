import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Column()
  nombre!: string;

  @Column()
  appaterno!: string;

  @Column({ nullable: true })
  apmaterno?: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password_hash!: string;

  @Column({ unique: true })
  ci!: string;

  @Column()
  rol!: string;

  @Column({ default: 1 })
  activo!: number; // 1 = Activo, 0 = Baja Lógica
}
