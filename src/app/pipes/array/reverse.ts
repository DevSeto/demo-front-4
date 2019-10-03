import {PipeTransform, Pipe} from '@angular/core';
import {isString} from '../helpers/helpers';

@Pipe({name: 'ReversePipe'})
export class ReversePipe implements PipeTransform {

  transform(input: any): any {
    if (isString(input)) {
      return input.split('').reverse().join('');
    }

    return Array.isArray(input)
      ? input.reverse()
      : input;
  }
}
