import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { OrdenesModule } from './modules/ordenes/ordenes.module'; // <-- 1. IMPORTA AQUÍ

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST', 'postgres'),
        port: parseInt(config.get<string>('POSTGRES_PORT', '5432'), 10),
        username: config.get<string>('POSTGRES_USER', 'postgres'),
        password: config.get<string>('POSTGRES_PASSWORD', ''),
        database: config.get<string>('POSTGRES_DB', 'chaperia_db'),
        autoLoadEntities: true,
        synchronize:
          config.get<string>('NODE_ENV', 'development') === 'development',
      }),
    }),
    AuthModule,
    ClientesModule,
    OrdenesModule, // modulos actuales
  ],
})
export class AppModule {}
