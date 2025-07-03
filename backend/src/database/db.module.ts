import { Module } from '@nestjs/common';
import { DatabaseConnectionModule } from './dbConnection/db.module';
import {
    category_rpository_name,
    client_rpository_name,
    db_provider_name,
    image_rpository_name,
    order_in_progress_rpository_name,
    order_rpository_name,
    product_rpository_name,
    sale_nomenclatures_rpository_name,
    tea_diary_repository_name,
    telegram_user_repository_name,
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
    OrderInProgress,
    TelegramUser,
    TeaDiary,
} from './entities';
import {
    CategoryService,
    ImageService,
    ProductService,
    ClientService,
    OrderService,
    SaleNomenclatureService,
    OrderInProgressService,
    TelegramUserService,
    TeaDiaryService,
} from './services';

const services = [
    SaleNomenclatureService,
    CategoryService,
    ImageService,
    ProductService,
    // PromotionService,
    ClientService,
    OrderService,
    OrderInProgressService,
    TeaDiaryService,
    TelegramUserService,
];

const providers = [
    { p: sale_nomenclatures_rpository_name, c: SaleNomenclature },
    { p: category_rpository_name, c: Category },
    { p: image_rpository_name, c: Image },
    { p: product_rpository_name, c: Product },
    // { p: promotion_rpository_name, c: Promotion },
    { p: client_rpository_name, c: Client },
    { p: order_rpository_name, c: Order },
    { p: order_in_progress_rpository_name, c: OrderInProgress },
    { p: tea_diary_repository_name, c: TeaDiary },
    { p: telegram_user_repository_name, c: TelegramUser },
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
