import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { NotesModule } from './notes/notes.module';
import { SortModule } from './sort/sort.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot(),
    NotesModule,
    SortModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
