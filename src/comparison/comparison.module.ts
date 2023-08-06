import { Module } from '@nestjs/common';
import { ComparisonService } from './comparison.service';
import { ComparisonController } from './comparison.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Comparison } from './entities/comparison.entity';
import { ComparisonApplication } from './comparison.application';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Comparison] }), UserModule],
  providers: [ComparisonService, ComparisonApplication],
  controllers: [ComparisonController],
})
export class ComparisonModule {}
