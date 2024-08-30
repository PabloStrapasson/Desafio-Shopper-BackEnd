import { Module } from '@nestjs/common';
import { MeasureModule } from './modules/measure/measure.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/postgres.config.service';
import { APP_FILTER } from '@nestjs/core';
import { BadRequestFilter } from './resource/filters/badRequest.filter';

@Module({
  imports: [
    MeasureModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
  ],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: BadRequestFilter }],
})
export class AppModule {}
