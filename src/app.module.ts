import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartridgesModule } from './cartridges/cartridges.module';

@Module({
  imports: [CartridgesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
