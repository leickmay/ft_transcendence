import { Module } from '@nestjs/common';

import { GameEventsGateway } from './gateways/gameEvents.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		AuthModule,
	],
	providers: [GameEventsGateway]
})
export class GameEventsModule {}