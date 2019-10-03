import { Injectable } from '@angular/core';
import { Model } from './model';

@Injectable()
export class FoldersModel extends Model {

    /**
     * Get folders list
     *
     */
    public getFolders() {
        const foldersList: any = this.getProperty('folders');

        return foldersList;
    }

    /**
     * Update folders list
     *
     * @param data
     */
    public updateFolders(data: any) {
        this.setProperty('folders', data);
    }

    /**
     * Empty folder list
     *
     */
    public emptyFolders() {
        this.deleteProperty('folders');
    }
}
