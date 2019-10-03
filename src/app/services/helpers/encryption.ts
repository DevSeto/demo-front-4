import * as crypto from 'crypto-js';

export class Encryption {

    private crypt: any = window['CryptoJS'];

    protected storage: any;

    constructor() {
        this.storage = window.localStorage;
    }

    private readonly ___: string = ']31*n|/wIuYE6<c];$fFae\'3)I*q2bE#QopYa4,Fm+y' +
        'AHM~}2UAt<B35lK@|xzuFFAEAE217BE472D585955a4219B26EA5A858E8F537' +
        'BE472D5859552017snash1sCDC6B94E1562A6B15A2CDF72UAt<B35lK@_-_-_' +
        '-_0-_1-_2-_3-_4-_5-_6-_7-_8-_9-_10-_11-_12-_13-_14-_15-_16-_17' +
        '-_18-_19-_20-|xzuFFAE219B26CDC6B94E1562A6B15A2CDF7';

    protected enCrypt(data: any): any {
        return crypto.AES.encrypt(JSON.stringify(data), this.___);
    }

    protected deCrypt(data: any): any {
        const bytes: any = crypto.AES.decrypt(data.toString(), this.___);
        return JSON.parse(bytes.toString(crypto.enc.Utf8));
    }

    protected keyEnCrypt(key: string): any {
        const hashObj: any    = crypto.HmacMD5(key, this.___);
        const hashString: any = hashObj.toString(crypto.enc.HEX);

        return hashString;
    }
}
