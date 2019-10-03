import {PipeTransform, Pipe} from '@angular/core';

@Pipe({name: 'numberedCycle'})
export class NumberedCycle implements PipeTransform {

    transform( count: number ): Array<string|number> {

        const returnedData: Array<string|number> = [];
        let sign: boolean = !!0;
        let i: number = count / 2;


        for ( i; i > 0; i-- ) {
            if ( ! sign ) {
                returnedData.push('-' + i);
            } else {
                returnedData.push('+' + i);
            }

            if ( i == 1 ) {
                if ( ! sign ) {
                    returnedData.push(0);
                    i = (count / 2) + 1;
                    sign = !!1;
                }
            }
        }

        return returnedData;
    }
}
