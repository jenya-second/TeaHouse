import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SABYModule } from './SABY/saby.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        SABYModule,
        ProductModule,
        ConfigModule.forRoot({
            envFilePath: 'dist/env/.env',
            isGlobal: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
