import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { OptionsModule } from 'src/options/options.module';
import { SearchModule } from 'src/search/search.module';
import { UserModule } from 'src/user/user.module';
import { EventsService } from './events.service';
import { EventsGateway } from './gateways/events.gateway';

@Module({
	imports: [
		forwardRef(() => AuthModule),
		forwardRef(() => UserModule),
		forwardRef(() => OptionsModule),
		forwardRef(() => ChatModule),
		forwardRef(() => SearchModule),
	],
	providers: [EventsGateway, EventsService],
	exports: [EventsService],
})
export class EventsModule {}
