import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';

const databaseImports = process.env.MONGODB_URI
  ? [MongooseModule.forRoot(process.env.MONGODB_URI)]
  : [];

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ...databaseImports, NotesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
