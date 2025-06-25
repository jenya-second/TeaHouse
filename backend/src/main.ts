import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });
    const configService = app.get<ConfigService>(ConfigService);
    await ConfigModule.envVariablesLoaded;
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Server is working on ${process.env.PORT ?? 3000} port...`);
}
bootstrap();
