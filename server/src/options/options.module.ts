import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		forwardRef(() => AuthModule),
		forwardRef(() => UserModule),
	],
	providers: [OptionsService],
	exports: [OptionsService],
})
export class EventsModule { }
