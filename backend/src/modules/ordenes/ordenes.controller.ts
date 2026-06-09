import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { CreateOrdenDto } from './dto/create-orden.dto';

@Controller('operaciones') // Ruta base: /api/operaciones
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Post('ordenes')
  async crearOrden(@Body() dto: CreateOrdenDto) {
    return this.ordenesService.crearOrden(dto);
  }

  @Get('ordenes')
  async listarTodas() {
    return this.ordenesService.obtenerTodas();
  }

  @Put('ordenes/:id/finalizar')
  async finalizarTrabajo(@Param('id') id: number) {
    return this.ordenesService.finalizarTrabajo(id);
  }

  // RUTAS PARA LOS GRÁFICOS LAS ESTADISTICAS Y DEMAS
  @Get('dashboard/ingresos')
  async totalIngresos() {
    return this.ordenesService.obtenerIngresosTotales();
  }

  @Get('dashboard/rendimiento')
  async rendimientoMecanicos() {
    return this.ordenesService.obtenerRendimientoMecanicos();
  }
  @Get('dashboard/resumen')
  async resumenDashboard() {
    return this.ordenesService.obtenerResumenDashboard();
  }
}
