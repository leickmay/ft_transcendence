import { forwardRef, Module } from '@nestjs/common';
import { EventsModule } from 'src/socket/events.module';
import { UserModule } from 'src/user/user.module';
import { GameService } from './game.service';

@Module({
	imports: [
		forwardRef(() => UserModule),
		forwardRef(() => EventsModule),
	],
	providers: [GameService],
	exports: [GameService],
})
export class GameModule {}
