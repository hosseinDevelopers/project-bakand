import { Dtoregister } from "../auth/dto/register.auth.dto";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { userServis } from "./users.service";

@Controller("user")
 
export class controllerApp{
    constructor(private readonly userServis: userServis){}
    // @Post("createuser")
    // create(@Body() dto: Dtoregister){
    //     const {name,username,password} = dto;
    //     return this.userServis.createUser(name,password,username)
    // }

}