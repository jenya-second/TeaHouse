import { Inject, Injectable } from '@nestjs/common';
import { image_rpository_name, saby_forimg_url } from 'src/constants';
import { Repository } from 'typeorm';
import { Image } from 'src/image/image.entity';
import { SABYService } from 'src/SABY/saby.service';
import { createWriteStream, readdirSync, unlinkSync } from 'fs';

@Injectable()
export class ImageService {
    constructor(
        @Inject(image_rpository_name)
        private imageRepository: Repository<Image>,
        private readonly SABYService: SABYService,
    ) {}

    async findAll(): Promise<Image[]> {
        return this.imageRepository.find({
            relations: {
                product: false,
            },
        });
    }

    async saveOne(product: Image): Promise<Image> {
        return this.imageRepository.save(product);
    }

    async saveMany(products: Image[]): Promise<Image[]> {
        return this.imageRepository.save(products);
    }

    async deleteAll(): Promise<any> {
        return this.imageRepository.query('delete from public.image');
    }

    async dlImage(
        url: string,
        path: string = 'dl_image/newpic.jpg',
    ): Promise<any> {
        return this.SABYService.SABYAuthGet(url, {}, 'stream').then((res) => {
            res.data.pipe(createWriteStream(path));
        });
    }

    async saveAllImages(images: Image[]): Promise<any> {
        images.forEach((img) => {
            this.dlImage(
                saby_forimg_url + img.sabyUrl,
                'dl_image/' + img.id + '.jpeg',
            );
        });
    }

    async delImagesInFolder() {
        const dir = './dl_image';
        for (const file of readdirSync(dir)) {
            unlinkSync(dir + '/' + file);
        }
    }

    async reloadImages(images: Image[] = null): Promise<void> {
        if (images === null) {
            images = await this.findAll();
            console.log(images);
        }
        await this.delImagesInFolder();
        return this.saveAllImages(images);
    }
}
