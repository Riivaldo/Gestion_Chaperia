import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteEntity } from './entities/cliente.entity';
import { VehiculoEntity } from './entities/vehiculo.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(ClienteEntity)
    private readonly clienteRepo: Repository<ClienteEntity>,

    @InjectRepository(VehiculoEntity)
    private readonly vehiculoRepo: Repository<VehiculoEntity>,
  ) {}

  // --- MÉTODOS DE CLIENTES ---
  async crearCliente(dto: CreateClienteDto): Promise<ClienteEntity> {
    const nuevo = this.clienteRepo.create({
      ...dto,
      apmaterno: dto.apmaterno || undefined,
      activo: 1,
    });
    return await this.clienteRepo.save(nuevo);
  }

  async obtenerClientesActivos(): Promise<ClienteEntity[]> {
    return await this.clienteRepo.find({ where: { activo: 1 } });
  }

  async eliminarLogicoCliente(id: number): Promise<{ mensaje: string }> {
    const cliente = await this.clienteRepo.findOne({
      where: { id_cliente: id },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    cliente.activo = 0; // Eliminación lógica
    await this.clienteRepo.save(cliente);
    return { mensaje: 'Cliente dado de baja correctamente' };
  }

  // --- MÉTODOS DE VEHÍCULOS ---
  async crearVehiculo(dto: CreateVehiculoDto): Promise<VehiculoEntity> {
    const nuevoAuto = this.vehiculoRepo.create({
      ...dto,
      placa: dto.placa.toUpperCase(), // Guardamos la placa siempre en mayúsculas
      activo: 1,
    });
    return await this.vehiculoRepo.save(nuevoAuto);
  }

  async obtenerVehiculosConDueño(): Promise<VehiculoEntity[]> {
    return await this.vehiculoRepo.find({
      where: { activo: 1 },
      relations: {
        cliente: true, // Sintaxis moderna de objeto para hacer el INNER JOIN automático
      },
    });
  }

  async buscarPorPlaca(placa: string): Promise<VehiculoEntity> {
    const vehiculo = await this.vehiculoRepo.findOne({
      where: { placa: placa.toUpperCase(), activo: 1 },
      relations: {
        cliente: true,
      },
    });
    if (!vehiculo)
      throw new NotFoundException(
        `No se encontró ningún vehículo activo con la placa ${placa}`,
      );
    return vehiculo;
  }
  async obtenerClientePorId(id: number): Promise<ClienteEntity> {
    const cliente = await this.clienteRepo.findOne({
      where: {
        id_cliente: id,
        activo: 1,
      },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return cliente;
  }
  async actualizarCliente(
    id: number,
    dto: UpdateClienteDto,
  ): Promise<ClienteEntity> {
    const cliente = await this.obtenerClientePorId(id);

    Object.assign(cliente, dto);

    return await this.clienteRepo.save(cliente);
  }
  async obtenerVehiculoPorId(id: number): Promise<VehiculoEntity> {
    const vehiculo = await this.vehiculoRepo.findOne({
      where: {
        id_vehiculo: id,
        activo: 1,
      },
      relations: {
        cliente: true,
      },
    });

    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return vehiculo;
  }
  async actualizarVehiculo(
    id: number,
    dto: UpdateVehiculoDto,
  ): Promise<VehiculoEntity> {
    const vehiculo = await this.obtenerVehiculoPorId(id);

    Object.assign(vehiculo, dto);

    if (dto.placa) {
      vehiculo.placa = dto.placa.toUpperCase();
    }

    return await this.vehiculoRepo.save(vehiculo);
  }
  async eliminarLogicoVehiculo(id: number): Promise<{ mensaje: string }> {
    const vehiculo = await this.obtenerVehiculoPorId(id);

    vehiculo.activo = 0;

    await this.vehiculoRepo.save(vehiculo);

    return {
      mensaje: 'Vehículo dado de baja correctamente',
    };
  }
}
