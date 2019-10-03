import { Injectable } from '@angular/core';
import { Encryption } from '../services/helpers/encryption';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class Model extends Encryption {

    public storageSub: any = new Subject<any>();
    public storage: any;

    constructor() {
        super();
    }

    /**
     * Get property from local storage
     *
     * @param propertyName
     */
     public getProperty(propertyName: string) {
        propertyName = this.keyEnCrypt(propertyName);

        if (!this.checkIfExistProperty(propertyName)) {
            return false;
        }

        const property: any = this.deCrypt(this.storage.getItem(propertyName));

        return property;
     }

    /**
     * Update property data
     *
     * @param propertyName
     * @param data
     */
    public setProperty(propertyName: string, data: any) {
        const localStorageKey: string = propertyName;
        propertyName = this.keyEnCrypt(propertyName);

        if (!this.checkIfExistProperty(propertyName)) {
            this.addProperty(propertyName, data);
        } else {
            data = this.enCrypt(data);
            this.storage.setItem(propertyName, data);
        }

        this.storageSub.next(this.getProperty(localStorageKey));
    }

    /**
     * Add property
     *
     * @param propertyName
     * @param data
     */
    public addProperty(propertyName: string, data: any) {
        const localStorageKey: string = propertyName;
        data = this.enCrypt(data);
        this.storage.setItem(propertyName, data);

        this.storageSub.next(this.getProperty(localStorageKey));
    }

    /**
     * Check if exist gived property in local storage
     *
     * @param propertyName
     */
    public checkIfExistProperty(propertyName: string) {
        if (!this.storage.getItem(propertyName)) {
            return false;
        }

        return true;
    }

    /**
     * Remove property from local storage
     *
     * @param propertyName
     */
    public deleteProperty(propertyName: string) {
        propertyName = this.keyEnCrypt(propertyName);

        if (this.checkIfExistProperty(propertyName)) {
            this.storage.removeItem(propertyName);
        }

        this.storageSub.next([]);
    }
}
