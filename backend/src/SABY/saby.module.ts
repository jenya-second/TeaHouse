import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SABYService } from './saby.service';

@Module({
    imports: [HttpModule],
    providers: [SABYService],
    exports: [SABYService],
})
export class SABYModule {}
