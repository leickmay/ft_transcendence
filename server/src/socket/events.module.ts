import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { GameModule } from 'src/game/game.module';
import { OptionsModule } from 'src/options/options.module';
import { StatsModule } from 'src/stats/stats.module';
import { UserModule } from 'src/user/user.module';
import { EventsService } from './events.service';
import { EventsGateway } from './gateways/events.gateway';

@Module({
	imports: [
		forwardRef(() => AuthModule),
		forwardRef(() => UserModule),
		forwardRef(() => OptionsModule),
		forwardRef(() => ChatModule),
		forwardRef(() => GameModule),
		forwardRef(() => StatsModule),
	],
	providers: [EventsGateway, EventsService],
	exports: [EventsService],
})
export class EventsModule {}
