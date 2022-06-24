import { forwardRef, Module } from '@nestjs/common';
import { EventsModule } from 'src/socket/events.module';
import { StatsModule } from 'src/stats/stats.module';
import { UserModule } from 'src/user/user.module';
import { GameService } from './game.service';

@Module({
	imports: [
		forwardRef(() => UserModule),
		forwardRef(() => EventsModule),
		forwardRef(() => StatsModule),
	],
	providers: [GameService],
	exports: [GameService],
})
export class GameModule {}
