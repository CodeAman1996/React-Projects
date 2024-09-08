import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { Avatar, AvatarSchema } from './avatar.schema'; 
import { MailModule } from 'src/mailer/mail.module';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [ 
    ClientsModule.register([
    {
      name: 'RABBITMQ_CLIENT',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'email_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  ]),

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Avatar.name, 
        schema: AvatarSchema,
      },
    ]),
    MailModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
