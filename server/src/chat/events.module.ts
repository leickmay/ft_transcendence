import { Module } from '@nestjs/common';

import { EventsGateway } from './gateways/events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		AuthModule,
		UserModule,
	],
	providers: [EventsGateway]
})
export class EventsModule {}
