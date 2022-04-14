import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
