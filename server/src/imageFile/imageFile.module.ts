import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ImageFile from "./imageFile.entity";
import ImageFileService from "./imageFile.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ImageFile])
    ],
    providers: [ImageFileService],
    exports: [ImageFileService],
})
export class ImageFileModule {}
