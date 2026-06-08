import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsuarioEntity } from './entities/usuario.entity';
import { LogAccesoEntity } from './entities/log-acceso.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepo: Repository<UsuarioEntity>,

    @InjectRepository(LogAccesoEntity)
    private readonly logRepo: Repository<LogAccesoEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async registrar(dto: RegisterDto): Promise<UsuarioEntity> {
    // 1. Verificar si el username ya existe
    const usernameExists = await this.usuarioRepo.findOne({
      where: { username: dto.username },
    });

    if (usernameExists) {
      throw new BadRequestException('El nombre de usuario ya está registrado');
    }

    // 2. Verificar si el CI ya existe
    const ciExists = await this.usuarioRepo.findOne({
      where: { ci: dto.ci },
    });

    if (ciExists) {
      throw new BadRequestException('El CI ya está registrado');
    }

    // 3. Encriptar la contraseña con SHA256
    const hashedPassword = crypto
      .createHash('sha256')
      .update(dto.password)
      .digest('hex');

    // 4. Crear el nuevo usuario (FORMA CORRECTA)
    const nuevoUsuario = new UsuarioEntity();
    nuevoUsuario.nombre = dto.nombre;
    nuevoUsuario.appaterno = dto.appaterno;
    nuevoUsuario.apmaterno = dto.apmaterno || undefined; // ← Usar undefined en lugar de null
    nuevoUsuario.username = dto.username;
    nuevoUsuario.password_hash = hashedPassword;
    nuevoUsuario.ci = dto.ci;
    nuevoUsuario.rol = dto.rol;
    nuevoUsuario.activo = 1;

    // 5. Guardar en la base de datos
    const usuarioGuardado = await this.usuarioRepo.save(nuevoUsuario);

    return usuarioGuardado;
  }

  async login(dto: LoginDto, ip: string, userAgent: string): Promise<any> {
    // 1. Verificar si el usuario existe y no está borrado (eliminación lógica)
    const usuario = await this.usuarioRepo.findOne({
      where: { username: dto.username, activo: 1 },
    });
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Encriptar la contraseña recibida para ver si coincide con el hash de la BD
    const hashIngresado = crypto
      .createHash('sha256')
      .update(dto.password)
      .digest('hex');
    if (hashIngresado !== usuario.password_hash) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Crear y guardar el Log de Acceso
    const nuevoLog = this.logRepo.create({
      id_usuario: usuario.id_usuario,
      ip: ip,
      evento: 'ingreso',
      browser: userAgent,
    });

    await this.logRepo.save(nuevoLog);

    // 4. Generar JWT
    const payload = {
      sub: usuario.id_usuario,
      username: usuario.username,
      rol: usuario.rol,
    };

    const token = this.jwtService.sign(payload);

    // 5. Responder al frontend
    return {
      token,
      user: {
        id_usuario: usuario.id_usuario,
        nombre: `${usuario.nombre} ${usuario.appaterno}`,
        rol: usuario.rol,
        username: usuario.username,
      },
    };
  }

  async obtenerMecanicos(): Promise<UsuarioEntity[]> {
    return this.usuarioRepo.find({
      where: [
        { rol: 'mecanico_chaperia', activo: 1 },
        { rol: 'mecanico_pintura', activo: 1 },
      ],
    });
  }

  async obtenerLogs() {
    return await this.logRepo.find({
      relations: {
        usuario: true,
      },
      order: {
        fecha_hora: 'DESC',
      },
    });
  }
}
