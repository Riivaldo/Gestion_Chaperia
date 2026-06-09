import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { OrdenesModule } from './modules/ordenes/ordenes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',

      host: process.env.DB_HOST,

      port: Number(process.env.DB_PORT),

      username: process.env.DB_USERNAME,

      password: process.env.DB_PASSWORD,

      database: process.env.DB_DATABASE,

      autoLoadEntities: true,

      synchronize: false,

      ssl: {
        rejectUnauthorized: false,
      },
    }),

    AuthModule,
    ClientesModule,
    OrdenesModule,
  ],
})
export class AppModule {}
