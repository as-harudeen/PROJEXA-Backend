import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { MailModule } from "../mail/mail.module";
import { RedisModule } from "../redis/redis.module";

@Module({
    imports: [PrismaModule, MailModule, RedisModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}