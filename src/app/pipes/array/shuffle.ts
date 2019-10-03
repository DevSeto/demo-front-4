import {PipeTransform, Pipe} from '@angular/core';

@Pipe({name: 'shuffle'})
export class ShufflePipe implements PipeTransform {

  transform(input: any): any[] {
    if (!Array.isArray(input)) {
      return input;
    }

    const shuffled = [...input];
    for (let i = 0, n = input.length - 1, l = n - 1; i < l; ++i) {
      const j = Math.floor(Math.random() * (n - i + 1)) + i;
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }
}
