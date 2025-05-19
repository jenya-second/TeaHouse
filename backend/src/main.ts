import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

async function bootstrap() {
    // const httpsOptions: { key: any; cert: any } = { key: '', cert: '' };
    // try {
    //     httpsOptions.key = readFileSync(
    //         '../cert/live/oichai.maslo-spb.ru/privkey.pem',
    //     );
    //     httpsOptions.cert = readFileSync(
    //         '../cert/live/oichai.maslo-spb.ru/fullchain.pem',
    //     );
    // } catch (e) {}
    const app = await NestFactory.create(AppModule, {
        cors: true,
        // httpsOptions: httpsOptions,
    });
    const configService = app.get<ConfigService>(ConfigService);
    await ConfigModule.envVariablesLoaded;
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Server is working on ${process.env.PORT ?? 3000} port...`);
}
bootstrap();
