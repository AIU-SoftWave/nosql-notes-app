import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

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
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>(
          'MONGODB_URI',
          'mongodb://localhost:27017/notes-app',
        );
        const logger = new Logger('DatabaseModule');
        if (uri) {
          logger.log(`Connecting to MongoDB (Mongoose) at ${sanitizeUri(uri)}`);
          return { uri };
        } else {
          logger.warn(
            'MONGODB_URI is not set – running without a database connection (in-memory mode)',
          );
          return { uri: '' };
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
