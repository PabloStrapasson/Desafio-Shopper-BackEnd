import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const config = new ConfigService();
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: config.get<string>('POSTGRES_HOST'),
  port: config.get<number>('POSTGRES_PORT'),
  username: config.get<string>('POSTGRES_USER'),
  password: config.get<string>('POSTGRES_PASSWORD'),
  database: config.get<string>('POSTGRES_DB'),
  entities: [__dirname + '/../**/*.entity{.js,.ts}'],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
