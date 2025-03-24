import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { SABYService } from '../SABY/saby.service';
import { Image } from 'src/image/image.entity';
import { ImageService } from 'src/image/image.service';
import { SABYProduct } from '@tea-house/types';
import { Category } from 'src/categories/category.entity';
import { CategoryService } from 'src/categories/category.service';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly SABYService: SABYService,
        private readonly imageService: ImageService,
        private readonly categoryService: CategoryService,
    ) {}

    @Get('all')
    async getProducts(): Promise<Category[]> {
        //return this.productService.findAll();
        return this.categoryService.findAll();
    }

    @Get('save')
    async saveProducts() {
        const SABYproducts: SABYProduct[] =
            await this.SABYService.GetProductsFromPriceList('10');
        let images: Image[] = [];
        let products: Product[] = [];
        let categories: Category[] = [];
        [images, products, categories] =
            this.productService.parceList(SABYproducts);
        this.imageService.saveAllImages(images);
        return (
            'Saved ' +
            (await this.categoryService.saveMany(categories)).length +
            ' categories;\n' +
            'Saved ' +
            (await this.productService.saveMany(products)).length +
            ' products;\n' +
            'Saved ' +
            (await this.imageService.saveMany(images)).length +
            ' images;\n' +
            (await this.imageService.reloadImages())
        );
    }

    @Get('del')
    async delAll() {
        this.categoryService.deleteAll();
        return this.productService.deleteAll();
    }

    @Get('img')
    async saveImg() {
        return this.imageService.reloadImages();
    }
}
