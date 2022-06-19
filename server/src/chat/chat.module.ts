import { forwardRef, Module } from '@nestjs/common';
import { EventsModule } from 'src/socket/events.module';
import { ChatService } from './chat.service';

@Module({
	imports: [
		forwardRef(() => EventsModule),
	],
	providers: [ChatService],
	exports: [ChatService],
})
export class ChatModule {}
