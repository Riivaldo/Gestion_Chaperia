import {
  Controller,
  Patch,
  Post,
  Get,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';

import { UpdateClienteDto } from './dto/update-cliente.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@Controller('taller') // Ruta base: http://localhost:3000/api/taller
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post('clientes')
  async crearCliente(@Body() dto: CreateClienteDto) {
    return this.clientesService.crearCliente(dto);
  }

  @Get('clientes')
  async listarClientes() {
    return this.clientesService.obtenerClientesActivos();
  }

  @Delete('clientes/:id')
  async eliminarCliente(@Param('id') id: number) {
    return this.clientesService.eliminarLogicoCliente(id);
  }

  @Post('vehiculos')
  async crearVehiculo(@Body() dto: CreateVehiculoDto) {
    return this.clientesService.crearVehiculo(dto);
  }

  @Get('vehiculos')
  async listarVehiculos() {
    return this.clientesService.obtenerVehiculosConDueño();
  }

  @Get('vehiculos/buscar/:placa')
  async buscarPorPlaca(@Param('placa') placa: string) {
    return this.clientesService.buscarPorPlaca(placa);
  }
  @Get('clientes/:id')
  async obtenerCliente(@Param('id') id: number) {
    return this.clientesService.obtenerClientePorId(+id);
  }
  @Patch('clientes/:id')
  async actualizarCliente(
    @Param('id') id: number,
    @Body() dto: UpdateClienteDto,
  ) {
    return this.clientesService.actualizarCliente(+id, dto);
  }
  @Get('vehiculos/:id')
  async obtenerVehiculo(@Param('id') id: number) {
    return this.clientesService.obtenerVehiculoPorId(+id);
  }
  @Patch('vehiculos/:id')
  async actualizarVehiculo(
    @Param('id') id: number,
    @Body() dto: UpdateVehiculoDto,
  ) {
    return this.clientesService.actualizarVehiculo(+id, dto);
  }
  @Delete('vehiculos/:id')
  async eliminarVehiculo(@Param('id') id: number) {
    return this.clientesService.eliminarLogicoVehiculo(+id);
  }
}
