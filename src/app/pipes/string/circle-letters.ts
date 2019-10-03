import {PipeTransform, Pipe} from '@angular/core';
import {isString} from '../helpers/helpers';

@Pipe({
    name: 'circleLetters'
})

export class CircleLetters implements PipeTransform {

    transform( text: string ): string {
        const splitedString: Array<string> = text.split(' ');
        let returnedString = '';

        if ( splitedString[0] ) {
            returnedString += splitedString[0][0];
        }

        if ( splitedString[1] ) {
            returnedString = splitedString[1][0];
        }

        return returnedString;
    }
}
