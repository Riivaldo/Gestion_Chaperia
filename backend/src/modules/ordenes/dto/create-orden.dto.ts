import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateOrdenDto {
  @IsNumber()
  @IsNotEmpty()
  id_vehiculo!: number;

  @IsNumber()
  @IsNotEmpty()
  id_mecanico!: number;

  @IsString()
  @IsNotEmpty({ message: 'La descripción del trabajo es requerida' })
  descripcion_falla!: string;

  @IsNumber()
  @IsPositive({ message: 'El monto debe ser un valor mayor a cero' })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  monto_total!: number;
}
