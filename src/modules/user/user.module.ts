import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { MulterModule } from "@nestjs/platform-express";



@Module({
    imports: [PrismaModule, MulterModule.register({
        dest: "./uploads"
    })],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}