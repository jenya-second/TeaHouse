import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/db.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SABYModule } from 'src/SABY/saby.module';
import { ImageModule } from 'src/image/image.module';
import { db_provider_name, product_rpository_name } from 'src/constants';
import { DataSource } from 'typeorm';
import { Product } from './product.entity';
import { CategoryModule } from 'src/categories/category.module';

@Module({
    imports: [DatabaseModule, SABYModule, ImageModule, CategoryModule],
    providers: [
        {
            provide: product_rpository_name,
            useFactory: (dataSource: DataSource) =>
                dataSource.getRepository(Product),
            inject: [db_provider_name],
        },
        ProductService,
    ],
    controllers: [ProductController],
})
export class ProductModule {}
