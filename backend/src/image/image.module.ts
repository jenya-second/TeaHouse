import { Module } from "@nestjs/common";
import { db_provider_name, image_rpository_name } from "src/constants";
import { DatabaseModule } from "src/database/db.module";
import { DataSource } from "typeorm";
import { Image } from 'src/image/image.entity'
import { ImageService } from "./image.service";
import { SABYModule } from "src/SABY/saby.module";
import ImageController from "./image.controller";

@Module({
    imports: [DatabaseModule, SABYModule],
    providers: [
        {
          provide: image_rpository_name,
          useFactory: (dataSource: DataSource) => dataSource.getRepository(Image),
          inject: [db_provider_name],
        },
        ImageService
    ],
    controllers:[
      ImageController
    ],
    exports:[
        ImageService
    ]
  })
  export class ImageModule {}