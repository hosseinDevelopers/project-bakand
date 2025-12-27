import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { userServis } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: userServis) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false,
      secretOrKey: "MY_SUPER_SECRET",
    });
  }

  async validate(payload: any) {
     
    const user = await this.userService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (!user.is_active) {
      throw new UnauthorizedException("Your account is inactive");
    }

    
    if (user.current_token !== payload.token) {
      throw new UnauthorizedException("Invalid or expired session");
    }

    return user;
  }
}
