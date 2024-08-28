import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CreateDatePipe implements PipeTransform {
  constructor() {}

  async transform(datetime: number) {
    const newDate = new Date(datetime);

    return newDate;
  }
}
