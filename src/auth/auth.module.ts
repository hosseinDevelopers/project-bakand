import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "../users/user.entity";
import { userModule } from "../users/users.module";



@Module({
 controllers: [AuthController],
 providers: [AuthService,],
 imports: [userModule,TypeOrmModule.forFeature([User])]
})
   

export class AuthModule {}