import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SABYModule } from './SABY/saby.module';
import { ProductModule } from './product/product.module';

@Module({
    imports: [SABYModule, ProductModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
