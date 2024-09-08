import { HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User, UserDocument, UserSchema } from '../users/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from '../mailer/mail.service';
import { CreateUserDto } from './users.dto';
import * as fs from 'fs'
import utils from 'src/utils';
import { Avatar, AvatarDocument } from './avatar.schema';
import { join } from 'path';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Avatar.name) private readonly avatarModel: Model<AvatarDocument>,
        @Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy,
        private mailService: MailService,
       
    ) {}


    async sendToQueue(pattern: string, data: any): Promise<void> {
        this.client.emit<any>(pattern, data);
        console.log("sent to email")
    }

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        const user = new this.userModel(createUserDto);
        return user.save();
    }

    async findUserAvatarById(id: string): Promise<string> {
        const user = await utils.getApi(id)
        return user.avatar;
    }

    async findOne(id: string) {
        return utils.getApi(id)
    }

    async storeAvatar(userId: string, hash: string): Promise<any> {
        const avatar = new this.avatarModel({ userId: userId, hash: hash });
        return avatar.save();
    }

    async getAvatar(userId: string): Promise<any> {
        return this.avatarModel.findOne({
            userId
        })
    }

    async remove(userId: string) {
        console.log(userId);
        const avatar = await this.avatarModel.findOne({ userId });
        console.log('avatar', avatar);

        if (!avatar) {
            throw new NotFoundException('Avatar not found');
        }
        const filename = `avatar-${userId}.jpg`;
        const filePath = join(process.cwd(), 'src', 'public', 'uploads', filename);

        try {
            const fileDeleted = fs.unlink(filePath, (error) => {
                if (error) {
                    console.error('Failed to delete file:', error);
                } else {
                    console.log('File deleted successfully');
                }
            });
            await this.avatarModel.findByIdAndDelete(userId);
        } catch (error) {
            console.error('Failed to delete avatar file or remove avatar data:', error);
            throw new InternalServerErrorException('Failed to delete avatar');
        }
    }

}

