import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const config = new ConfigService();
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: config.get<string>('DB_HOST'),
  port: config.get<number>('DB_PORT'),
  username: config.get<string>('DB_USERNAME'),
  password: config.get<string>('DB_PASSWORD'),
  database: config.get<string>('DB_NAME'),
  entities: [__dirname + '/../**/*.entity{.js,.ts}'],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
