import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
const logger = new Logger('AppModule');

const mongoUri = process.env.MONGODB_URI;

// MongooseModule powers the current notes repository implementation.
// DatabaseModule (TypeORM) provides the TypeORM connection that will be
// used by future entity-based repositories. Both share the same MongoDB
// instance and will coexist until the notes module is migrated to TypeORM.
const databaseImports = mongoUri
  ? [MongooseModule.forRoot(mongoUri), DatabaseModule]
  : [];

if (mongoUri) {
  logger.log('MongoDB URI configured – connecting to database');
} else {
  logger.warn(
    'MONGODB_URI is not set – running without a database connection (in-memory mode)',
  );
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ...databaseImports],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
