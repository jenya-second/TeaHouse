import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SABYService } from './saby.service';
import { SABYController } from './saby.controller';

@Module({
    imports: [ConfigModule.forRoot(), HttpModule],
    controllers: [SABYController],
    providers: [SABYService],
    exports: [SABYService],
})
export class SABYModule {}
