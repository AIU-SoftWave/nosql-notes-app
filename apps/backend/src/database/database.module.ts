import { Logger, DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const imports: any[] = [ConfigModule];

    const disableDb = process.env.DISABLE_DB === 'true';
    if (!disableDb) {
      imports.push(
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            const uri = configService.get<string>(
              'MONGODB_URI',
              'mongodb://localhost:27017/notes-app',
            );
            const logger = new Logger(DatabaseModule.name);
            if (uri) {
              logger.log(`Connecting to MongoDB (TypeORM) at ${sanitizeUri(uri)}`);
            }

            return {
              type: 'mongodb',
              url: uri,
              database: 'notes-app',
              synchronize: true,
              autoLoadEntities: true,
              useUnifiedTopology: true,
              extra: {
                serverSelectionTimeoutMS: 2000,
                connectTimeoutMS: 2000,
              },
            };
          },
          inject: [ConfigService],
        }),
      );
    } else {
      const logger = new Logger(DatabaseModule.name);
      logger.log('DISABLE_DB=true, skipping TypeORM initialization');
    }

    return {
      module: DatabaseModule,
      imports,
      exports: [],
    };
  }
}
