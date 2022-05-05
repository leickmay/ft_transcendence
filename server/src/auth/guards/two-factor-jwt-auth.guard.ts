import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TwoFactorJwtAuthGuard extends AuthGuard('two-factor-jwt') {
}
