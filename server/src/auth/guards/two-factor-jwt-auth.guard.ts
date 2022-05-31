import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class TwoFactorJwtAuthGuard extends AuthGuard('two-factor-jwt') {
	public constructor(private readonly reflector: Reflector) {
		super();
	}

	public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.get<boolean>("isPublic", context.getHandler());
		return isPublic || super.canActivate(context);
	}
}
