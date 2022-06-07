import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventsModule } from "src/socket/events.module";
import { Stats } from "./stats.entity";
import { StatsService } from "./stats.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Stats]),
		forwardRef(() => EventsModule),
	],
	providers: [StatsService],
	exports: [StatsService]
})
export class StatsModule {}