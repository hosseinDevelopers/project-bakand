import { Module } from "@nestjs/common";
import { userServis } from "./users.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { controllerApp } from "./users.controller";
import { User } from "./user.entity";
import { UserReservation } from "./Purchased.entity";




@Module({
 providers: [userServis],
 controllers: [controllerApp],
 imports: [TypeOrmModule.forFeature([User,UserReservation])],
 exports: [userServis]
})

export class userModule {}