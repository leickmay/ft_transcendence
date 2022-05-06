import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ImageFile from "./image.entity";
import ImageFileService from "./image.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([ImageFile])
	],
	providers: [ImageFileService],
	exports: [ImageFileService],
})
export class ImageFileModule {}
