import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common'

import mongoose from 'mongoose'

@Injectable()
export class MongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string' && metadata.data === 'id') {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new HttpException('Provided ID is not a valid mongo id', HttpStatus.BAD_REQUEST)
      }
    }

    return value
  }
}
