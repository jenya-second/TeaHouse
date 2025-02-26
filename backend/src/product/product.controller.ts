import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { SABYService } from '../SABY/saby.service';
import SABYProduct from 'src/types/SABYProduct';
import { Image } from 'src/image/image.entity';
import { ImageService } from 'src/image/image.service';
import { saby_forimg_url } from 'src/constants';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly SABYService: SABYService,
        private readonly imageService: ImageService,
    ) {}

    @Get('all')
    async getProducts(): Promise<Product[]> {
        return this.productService.findAll();
    }

    @Get('save')
    async saveProducts() {
        const SABYproducts: SABYProduct[] =
            await this.SABYService.GetProductsFromPriceList('10');
        const images: Image[] = [];
        const products: Product[] = [];
        SABYproducts.forEach((SABYproduct: SABYProduct) => {
            if (SABYproduct?.isParent) return;
            const newProduct = new Product(SABYproduct);
            products.push(newProduct);
            if (SABYproduct?.images == null) return;
            images.push(
                ...SABYproduct.images.map((image: string) => {
                    const img: Image = new Image();
                    img.sabyUrl = image;
                    img.product = newProduct;
                    return img;
                }),
            );
        });
        return (
            'Saved ' +
            (await this.productService.saveMany(products)).length +
            ' products;\n' +
            'Saved ' +
            (await this.imageService.saveMany(images)).length +
            ' images;\n'
        );
    }

    @Get('del')
    async delAll() {
        return this.productService.deleteAll();
    }

    @Get('img')
    async saveImg() {
        return this.imageService.saveAllImages();
    }
}
