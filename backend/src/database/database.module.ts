import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<'postgres' | 'mysql'>('DB_TYPE', 'mysql') as 'postgres' | 'mysql';
        const defaultPort = dbType === 'mysql' ? 3306 : 5432;
        const defaultUser = dbType === 'mysql' ? 'root' : 'postgres';
        
        // Parse port as number, fallback to default if not provided or invalid
        const port = configService.get<string>('DB_PORT');
        const parsedPort = port ? parseInt(port, 10) : defaultPort;
        
        return {
          type: dbType,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: parsedPort,
          username: configService.get<string>('DB_USERNAME', defaultUser),
          password: configService.get<string>('DB_PASSWORD', ''),
          database: configService.get<string>('DB_NAME', 'livsbookhub'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false), // Set to false in production
          logging: configService.get<boolean>('DB_LOGGING', false),
          extra: dbType === 'mysql' ? {
            charset: 'utf8mb4',
          } : undefined,
          ssl: configService.get<boolean>('DB_SSL', false) ? {
            rejectUnauthorized: false,
          } : false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

