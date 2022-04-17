import { Module } from "@nestjs/common";
import { JwtModule, JwtService} from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/user/user.module";
import { AuthService } from './auth.service';
import { JwtStrategy } from "./strategies/jwt.strategy";
import { jwtConstants } from "./constants";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '24h'},
        }),
    ],
    providers: [AuthService, JwtStrategy],
	controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}