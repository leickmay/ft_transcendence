import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { jwtConstants } from "../constants";
import { TotpException } from "../exceptions/totp.exception";

@Injectable()
export class TwoFactorJwtStrategy extends PassportStrategy(Strategy, 'two-factor-jwt') {
	constructor(
		private userService: UserService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret,
		});
	}

	async validate(payload: any): Promise<User | null> {
		if (payload.restricted) {
			throw new TotpException();
		}
		return await this.userService.get(payload.id);
	}
}
