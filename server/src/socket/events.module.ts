import { forwardRef, Module } from '@nestjs/common';

import { EventsGateway } from './gateways/events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { EventsService } from './events.service';

@Module({
	imports: [
		forwardRef(() => AuthModule),
		forwardRef(() => UserModule),
	],
	providers: [EventsGateway, EventsService],
	exports: [EventsService],
})
export class EventsModule {}
