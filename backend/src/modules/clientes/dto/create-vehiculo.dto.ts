import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateVehiculoDto {
  @IsNumber()
  @IsNotEmpty()
  id_cliente!: number;

  @IsString()
  @IsNotEmpty({ message: 'La placa es obligatoria' })
  placa!: string;

  @IsString()
  @IsNotEmpty({ message: 'La marca es obligatoria' })
  marca!: string;

  @IsString()
  @IsNotEmpty({ message: 'El modelo es obligatorio' })
  modelo!: string;

  @IsString()
  @IsNotEmpty({ message: 'El color es obligatorio' })
  color!: string;

  @IsNumber()
  @IsOptional()
  anio?: number;
}
