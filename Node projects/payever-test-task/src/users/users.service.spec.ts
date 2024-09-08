
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { MailService } from '../mailer/mail.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {}, 
        },
        {
          provide: getModelToken('Avatar'),
          useValue: {}, 
        },
        {
          provide: 'RABBITMQ_CLIENT',
          useValue: {}, 
        },
        {
          provide: MailService,
          useValue: {}, 
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
