import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from './auth.service';
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { TwoFactorJwtStrategy } from "./strategies/two-factor-jwt.strategy";

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '24h'},
		}),
	],
	providers: [AuthService, JwtStrategy, TwoFactorJwtStrategy],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}