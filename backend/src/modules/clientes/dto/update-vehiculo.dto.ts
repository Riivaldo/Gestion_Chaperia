import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateVehiculoDto {
  @IsOptional()
  @IsNumber()
  id_cliente?: number;

  @IsOptional()
  @IsString()
  placa?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  anio?: number;
}
