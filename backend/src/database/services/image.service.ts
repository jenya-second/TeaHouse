import { Inject, Injectable } from '@nestjs/common';
import { image_rpository_name, saby_forimg_url } from 'src/constants';
import { In, InsertResult, Repository } from 'typeorm';
import { SABYService } from 'src/SABY/saby.service';
import { createWriteStream, readdirSync, unlinkSync } from 'fs';
import { Image } from '../entities';
import { ProductService } from './product.service';

@Injectable()
export class ImageService {
    constructor(
        @Inject(image_rpository_name)
        private readonly imageRepository: Repository<Image>,
        private readonly productService: ProductService,
        private readonly SABYService: SABYService,
    ) {}

    async findAll(): Promise<Image[]> {
        return this.imageRepository.find({
            relations: {
                product: false,
            },
        });
    }

    async saveOne(image: Image): Promise<InsertResult> {
        return this.imageRepository.insert(image);
    }

    async saveMany(images: Image[]): Promise<InsertResult> {
        return this.imageRepository.insert(images);
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

    async updateImages(images: Image[]) {
        const actualImages = await this.findAll();
        const imagesToSave = images.filter((val) => {
            return !actualImages
                .map((val) => val.sabyUrl)
                .includes(val.sabyUrl);
        });
        const imagesToDel = actualImages.filter((val) => {
            return !images.map((val) => val.sabyUrl).includes(val.sabyUrl);
        });
        if (imagesToDel.length != 0) {
            await this.delImagesInFolder(imagesToDel.map((val) => val.id));
            await this.deleteByIds(imagesToDel.map((val) => val.id));
        }
        for (let i = 0; i < imagesToSave.length; i++) {
            const product = await this.productService.findByNomNumber(
                imagesToSave[i].product.nomNumber,
            );
            imagesToSave[i].product = product;
        }
        await this.imageRepository.insert(imagesToSave);
        await this.dlImages(imagesToSave);
    }

    async dlImages(images: Image[]): Promise<any> {
        const promises = [];
        images.forEach((img) => {
            promises.push(
                this.dlImage(
                    saby_forimg_url + img.sabyUrl,
                    'dl_image/' + img.id + '.jpeg',
                ),
            );
        });
        return Promise.all(promises);
    }

    delImagesInFolder(ids: number[] = []) {
        const dir = './dl_image';
        for (const file of readdirSync(dir)) {
            if (ids.length == 0 || ids.includes(+file.split('.')[0])) {
                unlinkSync(dir + '/' + file);
            }
        }
    }

    async deleteByIds(ids: number[]) {
        return this.imageRepository.delete({
            id: In(ids),
        });
    }
}
