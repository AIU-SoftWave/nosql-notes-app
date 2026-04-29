import { Module, Logger, OnApplicationShutdown } from '@nestjs/common';
import { TypeOrmModule, InjectDataSource } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

/** Strips credentials from a MongoDB URI for safe logging. */
function sanitizeUri(uri: string): string {
  try {
    const url = new URL(uri);
    url.password = url.password ? '****' : '';
    url.username = url.username ? '****' : '';
    return url.toString();
  } catch {
    return '<invalid URI>';
  }
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>(
          'MONGODB_URI',
          'mongodb://localhost:27017/notes-app',
        );
        const logger = new Logger('DatabaseModule');
        logger.log(`Connecting to MongoDB at ${sanitizeUri(uri)}`);
        return {
          type: 'mongodb',
          url: uri,
          // Entity classes will be registered here in future issues
          entities: [],
          synchronize: false,
          useUnifiedTopology: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onApplicationShutdown(signal?: string) {
    if (this.dataSource.isInitialized) {
      this.logger.log(
        `Closing MongoDB connection (signal: ${signal ?? 'unknown'})`,
      );
      await this.dataSource.destroy();
    }
  }
}
