import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SABYService } from './saby.service';
import { SABYController } from './saby.controller';

@Module({
    imports: [HttpModule],
    controllers: [SABYController],
    providers: [SABYService],
    exports: [SABYService],
})
export class SABYModule {}
