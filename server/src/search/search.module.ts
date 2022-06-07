import { forwardRef, Module } from '@nestjs/common';
import { EventsModule } from 'src/socket/events.module';
import { SearchService } from './search.service';

@Module({
	imports: [
		forwardRef(() => EventsModule),
	],
	providers: [SearchService],
	exports: [SearchService],
})
export class SearchModule { }
