import { Module } from '@nestjs/common';
import { InputMethodsController } from './input-methods.controller';
import { InputMethodsService } from './input-methods.service';

@Module({
  controllers: [InputMethodsController],
  providers: [InputMethodsService],
  exports: [InputMethodsService],
})
export class InputMethodsModule {}
