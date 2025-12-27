import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class userServis {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(dto: any) {
    const exists = await this.userRepo.findOne({ where: { username: dto.username } });

    if (exists) {
      throw new BadRequestException("User already exists");
    }

    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }

  async findByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } });
  }
  
  async findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async findByToken(token: string) {
  return this.userRepo.findOne({ where: { current_token: token} });
}
}
