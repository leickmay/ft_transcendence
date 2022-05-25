import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { EventsModule } from 'src/socket/events.module';
import { UserModule } from 'src/user/user.module';
import { ChatService } from './chat.service';

@Module({
	imports: [
		forwardRef(() => UserModule),
		forwardRef(() => EventsModule),
	],
	providers: [ChatService],
	exports: [ChatService],
})
export class ChatModule {}
