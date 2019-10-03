import { Injectable } from '@angular/core';
import { Model } from './model';

@Injectable()
export class StorageModel extends Model {

    /**
     * Get user storages
     *
     */
    public getUserStorages() {
        const storages: any = this.getProperty('storages');

        return storages;
    }

    /**
     * Update user storages
     *
     * @param data
     */
    public updateUserStorages(data: any) {
        this.setProperty('storages', data);
    }

    /**
     * Empty user storages
     *
     */
    public emptyUserStorages() {
        this.deleteProperty('storages');
    }
}
