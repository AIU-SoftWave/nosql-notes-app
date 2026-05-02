import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

function sanitizeUri(uri: string): string {
  try {
    const url = new URL(uri);
    if (url.username) url.username = '****';
    if (url.password) url.password = '****';
    return url.toString();
  } catch (e) {
    return '<invalid URI>';
  }
}

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const logger = new Logger('DatabaseModule');

    const imports = [
      ConfigModule,
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          const uri =
            configService.get('MONGODB_URI') ||
            process.env.MONGODB_URI ||
            'mongodb://localhost:27017/notes';
          // Log sanitized URI for security, but use actual URI for connection
          logger.log(`Connecting to MongoDB: ${sanitizeUri(uri)}`);
          return { uri };
        },
        inject: [ConfigService],
      }),
    ];

    return {
      module: DatabaseModule,
      imports,
      exports: [MongooseModule],
    };
  }
}
