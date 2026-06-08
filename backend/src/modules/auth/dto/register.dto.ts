import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsIn,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
  nombre!: string;

  @IsNotEmpty({ message: 'El apellido paterno es obligatorio' })
  @IsString({ message: 'El apellido paterno debe ser texto' })
  @MaxLength(100, {
    message: 'El apellido paterno no puede superar los 100 caracteres',
  })
  appaterno!: string;

  @IsOptional()
  @IsString({ message: 'El apellido materno debe ser texto' })
  @MaxLength(100, {
    message: 'El apellido materno no puede superar los 100 caracteres',
  })
  apmaterno?: string;

  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @IsString({ message: 'El nombre de usuario debe ser texto' })
  @MaxLength(50, {
    message: 'El nombre de usuario no puede superar los 50 caracteres',
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'El username solo puede contener letras, números y guión bajo',
  })
  username!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(255, { message: 'La contraseña es demasiado larga' })
  password!: string;

  @IsNotEmpty({ message: 'El CI es obligatorio' })
  @IsString({ message: 'El CI debe ser texto' })
  @MaxLength(20, { message: 'El CI no puede superar los 20 caracteres' })
  @Matches(/^\d+$/, { message: 'El CI solo debe contener números' })
  ci!: string;

  @IsNotEmpty({ message: 'El rol es obligatorio' })
  @IsIn(['admin', 'mecanico_chaperia', 'mecanico_pintura'], {
    message:
      'Rol no válido. Los roles permitidos son: admin, mecanico_chaperia, mecanico_pintura',
  })
  rol!: string;
}
