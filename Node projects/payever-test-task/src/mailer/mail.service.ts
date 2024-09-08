import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../users/users.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
  
    await this.mailerService.sendMail({
      to: 'amsaxena@bestpeers.com',
      from: 'amsaxena@bestpeers.com', 
      subject: 'Welcome to Payever App! Confirm your Email',
      text:'Hi , This is your first Name', 

    });
  }
}
