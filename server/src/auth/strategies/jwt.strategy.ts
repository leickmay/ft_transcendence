import { Injectable, SerializeOptions } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { plainToClass } from "class-transformer";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { jwtConstants } from "../constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private userService: UserService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret,
		});
	}

	async validate(payload: any): Promise<User> {
		return this.userService.get(payload.id);
	}
}
