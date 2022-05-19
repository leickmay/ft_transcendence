import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { OptionsModule } from 'src/options/options.module';
import { UserModule } from 'src/user/user.module';
import { EventsService } from './events.service';
import { EventsGateway } from './gateways/events.gateway';

@Module({
	imports: [
		forwardRef(() => AuthModule),
		forwardRef(() => UserModule),
		forwardRef(() => OptionsModule),
	],
	providers: [EventsGateway, EventsService],
	exports: [EventsService],
})
export class EventsModule {}
