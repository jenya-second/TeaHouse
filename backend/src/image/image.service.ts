import { Inject, Injectable } from '@nestjs/common';
import { image_rpository_name, saby_forimg_url } from 'src/constants';
import { Repository } from 'typeorm';
import { Image } from 'src/image/image.entity';
import { SABYService } from 'src/SABY/saby.service';
import { createWriteStream } from 'fs';

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
                product: true,
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

    async saveAllImages(): Promise<any> {
        const images: Image[] = await this.findAll();
        images.forEach((img) => {
            this.dlImage(
                saby_forimg_url + img.sabyUrl,
                'dl_image/' + img.id + '.jpeg',
            );
        });
    }
}
