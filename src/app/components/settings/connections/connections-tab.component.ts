import { Component } from '@angular/core';
import { GlobalVariables } from '../../../global.variables';
import { UsersService } from '../../../services/component/users.service';
import { StorageService } from '../../../services/global/storage.service';
import { StorageModel } from '../../../models/storage.model';

@Component({
    selector: 'connections-tab',
    templateUrl: '../../../html/settings/connections-tab.component.html'
})

export class ConnectionsTabComponent {

    public userId: string;
    private intervalId: any        = null;
    private intervalLength: number = 100;
    private windowHandle: any      = null;
    public externalStorages: any   = {
        gdrive   : false,
        dropbox  : false,
        onedrive : false
    };

    constructor(
        private usersService   : UsersService,
        private storageService : StorageService,
        private storageModel   : StorageModel
    ) {
        this.userId = GlobalVariables.LOGGED_USER_ID;
        this.getUserExternalStorages();
    }

    /**
     * Grant cloud access
     *
     * @param cloud
     * @param type
     */
    public grantAccessCloud(cloud: any, type: string) {
        const self: any = this;

        if (!type) {
            if (cloud.type == 'gdrive') {
                cloud.type = 'google-drive';
            }

            this.windowHandle = window.open('', cloud.title, 'width=800,height=600');
            this.storageService.getCloudAuth(cloud.type).then((data: any) => {
                if (data.status) {
                    this.windowHandle.location.href = data.url;
                    this.intervalId = setInterval(() => {
                        if (this.windowHandle.closed) {
                            clearInterval(this.intervalId);
                            self.storageModel.emptyUserStorages();
                            setTimeout(function() {
                                self.getUserExternalStorages();
                            }, 800);
                        }
                    }, this.intervalLength);
                }
            });
        } else {
            const userData: any = {
                user_id      : GlobalVariables.LOGGED_USER_ID,
                storage_type : cloud.type
            };

            this.usersService.deleteStorage(userData).then((data: any) => {
                if (data.status) {

                    const storage: string          = cloud.type;
                    self.externalStorages[storage] = false;
                    const storages: any            = self.storageModel.getUserStorages();

                    storages.splice(storages.findIndex(e => e.storage === storage), 1);
                    self.storageModel.updateUserStorages(storages);
                }
            });
        }
    }

    /**
     * Get user external storages
     */
    public getUserExternalStorages() {
        const self: any = this;

        if (this.storageModel.getUserStorages()) {
            const storages: any = this.storageModel.getUserStorages();
            storages.forEach(item => {
                const storage: any = item.storage;
                self.externalStorages[storage] = true;
            });
        } else {
            const storages: any = [];
            this.usersService.getUserStorages(GlobalVariables.LOGGED_USER_ID).then((data: any) => {
                if (data.status) {
                    data.user_storages.forEach(item => {
                        const storage: any = item.storage_type;
                        self.externalStorages[storage] = true;

                        self.usersService.getStorageSpace(storage, self.userId).then((res: any) => {
                            if (res.space) {
                                storages.push(res.space);
                                if (self.getCount() == storages.length) {
                                    self.storageModel.updateUserStorages(storages);
                                }
                            }
                        });
                    });
                }
            });
        }
    }

    /**
     * Get count storage
     */
    public getCount() {
        let count: number   = 0;
        const storages: any = this.externalStorages;

        Object.keys(storages).map(function(objectKey: any, index: any) {
            const storage: any = storages[objectKey];
            if (storage) {
                count++;
            }
        });

        return count;
    }
}
