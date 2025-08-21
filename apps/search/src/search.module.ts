import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
  ],
  controllers: [SearchController],
  providers: [
    SearchService
  ],
})
export class SearchModule {}
