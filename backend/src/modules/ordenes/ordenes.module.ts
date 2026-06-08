import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenEntity } from './entities/orden.entity';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenEntity])],
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}
