import { Controller, Get, Param, StreamableFile } from "@nestjs/common";
import { ImageService } from "./image.service";
import { createReadStream } from "fs";
import { join } from "path";

@Controller('image')
export default class ImageController {
    constructor(private readonly imageService: ImageService
    ) {}

    @Get(':id')
    getImage(@Param('id') id: number): StreamableFile {
        const file = createReadStream(join(process.cwd(), `dl_image/${id}.jpeg`));
        return new StreamableFile(file,{
            type: 'image/jpeg'
          });
    }
}