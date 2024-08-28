//import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'root',
  database: 'db_shopper',
  entities: [__dirname + '/../**/*.entity{.js,.ts}'],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
