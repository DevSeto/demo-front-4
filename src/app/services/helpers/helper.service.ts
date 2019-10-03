import { Injectable } from '@angular/core';

@Injectable()
export class _ {

    constructor() {}

    public static _: string = String();

    public static e: Function = (error: any = ''): void => {
        console.error('LOGGER', error);
    }

    public static l: Function = (log: any = ''): void => {
        console.warn('LOGGER', log);
    }

    public static if_exist: any = (data: any, value: any): boolean => data.some(
        (element: any): boolean => element === value
    )

    public static gaussRound(num: number, decimalPlaces: number): number {
        const d: number = decimalPlaces || 0,
            m: number = Math.pow(10, d),
            n: number = +(d ? num * m : num).toFixed(8),
            i: number = Math.floor(n), f = n - i,
            e = 1e-8,
            r: number = (f > 0.5 - e && f < 0.5 + e) ?
                ((i % 2 == 0) ? i : i + 1) : Math.round(n);

        return d ? r / m : r;
    }

    public static empty(data: any): boolean {
        let type: string = typeof data,
            returnedType: boolean;

        if (type == 'function') {
            data = data();
            type = typeof data;
        }

        switch (type) {
            case 'object':
            case 'string':
                returnedType = !!Object.keys(data).length;
                break;
            case 'number':
            case 'boolean':
                returnedType = data;
                break;
            default:
                returnedType = !!0;
        }

        return returnedType;
    }

    public static hierarchicalObjectToArray(data: any, callbackFunction: any, memo: any): Array<any> {
        let returnedData: any;

        const iterator: Function = (value: any, path: any) => {
            const type: string = Object.prototype.toString.call(value);

            memo = callbackFunction(memo, value, path);

            if (type === '[object Array]') {
                for (let i = 0, len = value.length; i < len; i++) {
                    iterator(value[i], path.concat(i));
                }
            } else if (type === '[object Object]') {
                for (const key in value) {
                    if (value.hasOwnProperty(key) && path.concat.hasOwnProperty(key)) {
                        iterator(value[key], path.concat(key));
                    }
                }
            }

            return memo;
        };

        returnedData = iterator(data, []);

        Object.keys(returnedData).forEach((key: any) => {

            if (typeof returnedData[key] == 'object') {
                delete returnedData[key];
            }
        });

        return returnedData;
    }



    /**
     * User friendly size format
     *
     * @param bytes
     * @param si
     * @returns {string}
     */
    public humanFileSize(bytes: number, si: any = true) {
        const thresh: number = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units: any = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

        let u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);

        return bytes.toFixed(1) + ' ' + units[u];
    }
}
