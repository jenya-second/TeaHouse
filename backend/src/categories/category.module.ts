import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/db.module';
import { SABYModule } from 'src/SABY/saby.module';
import { category_rpository_name, db_provider_name } from 'src/constants';
import { DataSource } from 'typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Module({
    imports: [DatabaseModule, SABYModule],
    providers: [
        {
            provide: category_rpository_name,
            useFactory: (dataSource: DataSource) =>
                dataSource.getRepository(Category),
            inject: [db_provider_name],
        },
        CategoryService,
    ],
    exports: [CategoryService],
})
export class CategoryModule {}
