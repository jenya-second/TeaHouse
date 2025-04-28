import { Controller, Get, Inject, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import {
    CategoryService,
    ClientService,
    ImageService,
    OrderService,
    ProductService,
    SaleNomenclatureService,
} from './database/services';
import {
    Category,
    Product,
    Image,
    Client,
    Order,
    SaleNomenclature,
} from './database/entities';
import { RefreshService } from './refresh/refresh.service';

@Controller()
export class AppController {
    constructor(
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService,
        private readonly refreshService: RefreshService,
    ) {}

    @Get('image/:id')
    getImage(@Param('id') id: number): StreamableFile {
        const file = createReadStream(
            join(process.cwd(), `dl_image/${id}.jpeg`),
        );
        return new StreamableFile(file, {
            type: 'image/jpeg',
        });
    }

    @Get('product')
    async getProducts(): Promise<Category[]> {
        return this.categoryService.findAll();
    }

    @Get('product/:id')
    async getProductById(@Param('id') id: number): Promise<Product> {
        return this.productService.findById(id);
    }
}
