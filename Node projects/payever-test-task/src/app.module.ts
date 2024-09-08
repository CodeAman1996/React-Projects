import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Module({
  imports: [MongooseModule.forRootAsync({
    useFactory: async () => {
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      return { uri }
    }
  }), UsersModule,],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
