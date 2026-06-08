import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsuarioEntity } from './entities/usuario.entity';
import type { Request } from 'express';

@Controller('auth') // La URL base será http://localhost:3000/api/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 1. Ruta para registrar nuevos usuarios/empleados
  @Post('registrar')
  async registrar(@Body() dto: RegisterDto): Promise<UsuarioEntity> {
    return this.authService.registrar(dto);
  }

  // 2. Ruta para el inicio de sesión (Login)
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request): Promise<any> {
    // Extraemos la IP y el Navegador del cliente para el Log automático
    const ip = req.ip || '127.0.0.1';
    const browser = req.headers['user-agent'] || 'Desconocido';

    return this.authService.login(dto, ip, browser);
  }
  @Get('mecanicos')
  async obtenerMecanicos() {
    return this.authService.obtenerMecanicos();
  }
  @Get('logs-accesos')
  async obtenerLogs() {
    return this.authService.obtenerLogs();
  }
}
