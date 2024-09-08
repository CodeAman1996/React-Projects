import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';
import { MailService } from '../mailer/mail.service';
import { FileInterceptor } from '@nestjs/platform-express';
import utils from 'src/utils';
import { join } from 'path';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private mailService: MailService) { }
    @Post()
    async create(@Body() createEmployeeDto: CreateUserDto) {
        const user = await this.usersService.create(createEmployeeDto)
        try {
            await this.mailService.sendUserConfirmation(user);
            const emailData = {
                email: user.email,
                subject: 'Welcome to Our Community',
                html: `<p>Hello ${user.first_name},</p>
                  <p>Welcome to our community! Your account is now active.</p>
                  <p>Enjoy your time with us!</p>`,
              };
            await this.usersService.sendToQueue("email_queue",emailData)
            console.log("email is sent over queue",emailData);
        } catch (error) {
            console.log(error, 'sdfgh')
        }
        return user
    }

    @Get('/:id')
    getUser(@Param('id') id: string) {
        return this.usersService.findOne(id)
    }

    @Get('/:id/avatar')
    async getUserAvatar(@Param('id') id: string) {
       const isAvailable = await this.usersService.getAvatar(id);
       console.log(isAvailable)
       if(isAvailable){
        return utils.loaclImgToBase64(isAvailable.hash);
       }
        const url = await this.usersService.findUserAvatarById(id);
        const destinationDir = join(process.cwd(), 'src', 'public', 'uploads');
        const destinationPath = join(destinationDir, `avatar-${id}.jpg`);
        

        try {
            await utils.ensureDirectoryExists(destinationDir)
            await utils.downloadAndSaveImage(url, destinationPath);
            await this.usersService.storeAvatar(id,destinationPath);
        } catch (error) {
            console.error('Failed to download and save image:', error);
            return 'Something went wrong'
        }
console.log('sdfgh',destinationPath)
        return utils.loaclImgToBase64(destinationPath);
    }

    @Delete('/:id/avatar')
    deleteUser(@Param('id') id: string) {
        return this.usersService.remove(id)
    }

}


