import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ImageFileController from "./imageFile.controller";
import ImageFile from "./imageFile.entity";
import ImageFileService from "./imageFile.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ImageFile])
    ],
    providers: [ImageFileService],
    controllers: [ImageFileController],
    exports: [ImageFileService],
})
export class ImageFileModule {}
