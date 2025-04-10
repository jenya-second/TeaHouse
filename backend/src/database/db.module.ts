import { Module } from '@nestjs/common';
import { DatabaseConnectionModule } from './dbConnection/db.module';
import {
    category_rpository_name,
    client_rpository_name,
    db_provider_name,
    image_rpository_name,
    order_rpository_name,
    product_rpository_name,
    sale_nomenclatures_rpository_name,
} from 'src/constants';
import { DataSource } from 'typeorm';
import { SABYModule } from 'src/SABY/saby.module';
import {
    Category,
    Client,
    Order,
    Product,
    SaleNomenclature,
    Image,
} from './entities';
import {
    CategoryService,
    ImageService,
    ProductService,
    ClientService,
    OrderService,
    SaleNomenclatureService,
} from './services';

const services = [
    CategoryService,
    ImageService,
    ProductService,
    ClientService,
    OrderService,
    SaleNomenclatureService,
];

const providers = [
    { p: category_rpository_name, c: Category },
    { p: image_rpository_name, c: Image },
    { p: product_rpository_name, c: Product },
    { p: client_rpository_name, c: Client },
    { p: sale_nomenclatures_rpository_name, c: SaleNomenclature },
    { p: order_rpository_name, c: Order },
];

@Module({
    imports: [DatabaseConnectionModule, SABYModule],
    providers: [
        ...providers.map((a) => {
            return {
                provide: a.p,
                useFactory: (dataSource: DataSource) =>
                    dataSource.getRepository(a.c),
                inject: [db_provider_name],
            };
        }),
        ...services,
    ],
    exports: [...services],
})
export class DatabaseModule {}
