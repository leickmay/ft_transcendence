import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";
import ImageFile from "./image.entity";

@Injectable()
class ImageFileService {
	constructor(
		@InjectRepository(ImageFile)
		private imageFileRepository: Repository<ImageFile>
	) {}

	async uploadImageFile(dataBuffer: Buffer, filename: string, queryRunner: QueryRunner) {
		const newFile = await queryRunner.manager.create(ImageFile, {
			filename,
			data: dataBuffer
		})
		await queryRunner.manager.save(ImageFile, newFile);
		return newFile;
	}


	async deleteImageFile(fileId: number, queryRunner: QueryRunner) {
		const deleteResponse = await queryRunner.manager.delete(ImageFile, fileId);
		if (!deleteResponse.affected) {
			throw new NotFoundException();
		}
	}

	async getImageById(imageId: number) {
		const image = await this.imageFileRepository.findOne(imageId);
		console.log("image : ", image);
		if (!image) {
			throw new NotFoundException();
		}
		return image;
	}
}

export default ImageFileService;
