import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class RequiredParamPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null || value === '') {
      throw new BadRequestException(`Parameter '${metadata.data}' is required`);
    }
    return value;
  }
}
