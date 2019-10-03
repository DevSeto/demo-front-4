import { Injectable } from '@angular/core';
import { Model } from './model';

@Injectable()
export class FilesModel extends Model {

    /**
     * Get downloaded files list
     *
     */
    public getFiles() {
        const fileList: any = this.getProperty('files');

        return fileList;
    }

    /**
     * Update downloaded files list
     *
     * @param data
     */
    public updateFiles(data: any) {
        this.setProperty('files', data);
    }
}
