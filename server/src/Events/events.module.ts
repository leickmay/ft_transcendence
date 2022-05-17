import { Module } from '@nestjs/common';

import { EventsGateway } from './gateways/events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { gameService } from './game/game.service';

@Module({
	imports: [
		AuthModule,
	],
	providers: [EventsGateway, gameService]
})
export class EventsModule {}
