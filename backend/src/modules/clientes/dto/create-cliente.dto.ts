import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido paterno es obligatorio' })
  appaterno!: string;

  @IsString()
  @IsOptional()
  apmaterno?: string;

  @IsString()
  @IsNotEmpty({ message: 'El CI o NIT es obligatorio' })
  ci!: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  telefono!: string;

  @IsString()
  @IsNotEmpty({ message: 'La zona o ciudad es obligatoria' })
  zona!: string;
}
