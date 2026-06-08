import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenEntity } from './entities/orden.entity';
import { CreateOrdenDto } from './dto/create-orden.dto';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(OrdenEntity)
    private readonly ordenRepo: Repository<OrdenEntity>,
  ) {}

  // Crear nueva orden de ingreso
  async crearOrden(dto: CreateOrdenDto): Promise<OrdenEntity> {
    const nuevaOrden = this.ordenRepo.create({
      ...dto,
      estado: 'en_proceso',
    });
    return await this.ordenRepo.save(nuevaOrden);
  }

  // Listar todas las órdenes con sus JOINS (para ver qué auto y qué mecánico es)
  async obtenerTodas(): Promise<OrdenEntity[]> {
    return await this.ordenRepo.find({
      relations: {
        vehiculo: true,
        mecanico: true,
      },
      order: { fecha_ingreso: 'DESC' }, // Las más recientes primero
    });
  }

  // Cambiar estado a terminado cuando el mecánico entrega el auto
  async finalizarTrabajo(id: number): Promise<OrdenEntity> {
    const orden = await this.ordenRepo.findOne({ where: { id_orden: id } });
    if (!orden) throw new NotFoundException('Orden de trabajo no encontrada');

    orden.estado = 'terminado';
    return await this.ordenRepo.save(orden);
  }

  // =========================================================================
  // MÉTODOS ESTADÍSTICOS PARA LOS GRÁFICOS DEL DASHBOARD (RÚBRICA)
  // =========================================================================

  // 1. Gráfico de Ingresos Totales: Suma todo el dinero recaudado
  // 1. Gráfico de Ingresos Totales: Suma todo el dinero recaudado
  async obtenerIngresosTotales(): Promise<{ ingresos_totales: number }> {
    // Le decimos a TypeScript que el resultado es un arreglo estricto de OrdenEntity
    const resultado: OrdenEntity[] = await this.ordenRepo.find();

    // Tipamos explícitamente tanto el acumulador (sum) como el elemento actual (orden)
    const total = resultado.reduce(
      (sum: number, orden: OrdenEntity): number => {
        return sum + Number(orden.monto_total);
      },
      0,
    );

    return { ingresos_totales: total };
  }

  // 2. Gráfico de Rendimiento: Cuenta cuántos autos terminó cada mecánico
  // 2. Gráfico de Rendimiento: Cuenta cuántos autos terminó cada mecánico
  // 2. Gráfico de Rendimiento: Cuenta cuántos autos terminó cada mecánico
  async obtenerRendimientoMecanicos(): Promise<
    Array<{ mecanico: string; autos_terminados: number }>
  > {
    // Truco definitivo: Declaramos la variable directamente como un arreglo de cualquier objeto (any[])
    // De esta forma evitamos hacer una aserción floja con 'as' al final
    const resultadoNativo: any[] = await this.ordenRepo
      .createQueryBuilder('orden')
      .leftJoinAndSelect('orden.mecanico', 'mecanico')
      .select([
        "CONCAT(mecanico.nombre, ' ', mecanico.appaterno) AS mecanico",
        'COUNT(orden.id_orden)::INTEGER AS autos_terminados',
      ])
      .where('orden.estado = :estado', { estado: 'terminado' })
      .groupBy('mecanico.id_usuario')
      .addGroupBy('mecanico.nombre')
      .addGroupBy('mecanico.appaterno')
      .getRawMany();

    // Mapeamos de forma segura convirtiendo cada propiedad para el reporte de React
    return resultadoNativo.map((item: Record<string, any>) => ({
      mecanico: String(item.mecanico || 'Desconocido'),
      autos_terminados: Number(item.autos_terminados || 0),
    }));
  }
  async obtenerResumenDashboard() {
    // Todas las órdenes
    const ordenes = await this.ordenRepo.find();

    // Ingresos totales
    const ingresosTotales = ordenes.reduce(
      (sum, orden) => sum + Number(orden.monto_total),
      0,
    );

    // Órdenes finalizadas
    const ordenesFinalizadas = ordenes.filter(
      (o) => o.estado === 'terminado',
    ).length;

    // Órdenes en proceso
    const ordenesEnProceso = ordenes.filter(
      (o) => o.estado === 'en_proceso',
    ).length;

    // Rendimiento mecánicos
    const rendimiento = await this.obtenerRendimientoMecanicos();

    return {
      ingresos_totales: ingresosTotales,
      ordenes_finalizadas: ordenesFinalizadas,
      ordenes_en_proceso: ordenesEnProceso,
      rendimiento,
    };
  }
}
