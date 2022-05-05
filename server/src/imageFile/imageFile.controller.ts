import { ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, Res, StreamableFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Readable } from "stream";
import ImageFileService from "./imageFile.service";


@UseGuards(JwtAuthGuard)
@Controller('image-files')
@UseInterceptors(ClassSerializerInterceptor)
export default class ImageFileController {
    constructor(
        private readonly imageFileService: ImageFileService
    ) {}

    @Get(':id')
    async getImageFileById(@Res({ passthrough: true }) response: Response, @Param('id', ParseIntPipe) id: number) {
        const file = await this.imageFileService.getImageById(id);

        const stream = Readable.from(file.data);

        response.set({
            'Content-Disposition': `inline; filename="${file.filename}"`,
            'Content-Type': 'image'
        })

        return new StreamableFile(stream);

    }
}