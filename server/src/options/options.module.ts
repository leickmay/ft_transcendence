import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { EventsModule } from 'src/socket/events.module';
import { UserModule } from 'src/user/user.module';
import { OptionsService } from './options.service';

@Module({
	imports: [
		forwardRef(() => AuthModule),
		forwardRef(() => UserModule),
		forwardRef(() => EventsModule),
	],
	providers: [OptionsService],
	exports: [OptionsService],
})
export class OptionsModule { }
