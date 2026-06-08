import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from './entities/cliente.entity';
import { VehiculoEntity } from './entities/vehiculo.entity';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteEntity, VehiculoEntity])],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [TypeOrmModule, ClientesService], // Exportamos para que el módulo de Órdenes pueda usar este servicio más adelante
})
export class ClientesModule {}
