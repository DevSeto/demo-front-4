import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChangesService } from '../../services/global/changes.service';
import { UsersService } from '../../services/component/users.service';
import { FoldersService} from '../../services/component/folders.service';
import { GlobalServices } from '../../services/global/global.services';
import { GlobalVariables } from '../../global.variables';
import { StorageModel } from '../../models/storage.model';
import { fadeAnimation } from '../../animations/fade.animation';

@Component({
    selector: 'app-header',
    templateUrl: '../../html/layout/header.component.html',
    styleUrls: ['../../css/header.component.css'],
    animations: [fadeAnimation]
})

export class LayoutHeaderComponent implements OnInit {

    public activeLanguage: string;
    public email: string             = '';
    public animationState: string    = 'out';
    public storages: any             = [];
    public nzbCloudUsedSpace: number = 0;
    public notificationCount: number = 0;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (event.target.innerWidth >= 990) {
            this.animationState = 'in';
        } else {
            this.animationState = 'out';
        }
    }

    constructor(
        private router         : Router,
        private translate      : TranslateService,
        private usersService   : UsersService,
        private foldersService : FoldersService,
        private storageModel   : StorageModel,
        private changes        : ChangesService
    ) {
        if (window.innerWidth >= 990) {
            this.animationState = 'in';
        } else {
            this.animationState = 'out';
        }

        this.activeLanguage = GlobalServices.getLanguage();

        this.changes.uploadChange.subscribe(() => {
            this.getUserUsedSpace(GlobalVariables.LOGGED_USER_ID);
        });
    }

    ngOnInit() {
        if (GlobalServices.isLogged()) {
            this.foldersService.getNotOpenedCount(GlobalVariables.LOGGED_USER_ID).then((response: any) => {
                this.notificationCount = response.count
            });

            this.email = GlobalVariables.USER.email;

            this.getUserExternalStorages();

            this.storageModel.storageSub.subscribe((storages: any) => {
                this.storages = storages;
            });
        }
    }

    /**
     * Get user external storages
     */
    public getUserExternalStorages() {
        const self: any      = this;
        const userId: string = GlobalVariables.LOGGED_USER_ID;
        this.storages        = [];

        if (this.storageModel.getUserStorages()) {
            this.storages = this.storageModel.getUserStorages();
        } else {
            this.usersService.getUserStorages(GlobalVariables.LOGGED_USER_ID).then((response: any) => {
                if (response.status) {
                    response.user_storages.forEach(item => {
                        const storage: any = item.storage_type;

                        self.usersService.getStorageSpace(storage, userId).then((res: any) => {
                            if (res.space) {
                                self.storages.push(res.space);

                                if (response.user_storages.length == self.storages.length) {
                                    self.storageModel.updateUserStorages(self.storages);
                                }
                            }
                        });
                    });
                }
            });
        }

        this.getUserUsedSpace(userId);
    }

    public getUserUsedSpace(userId: string) {
        this.foldersService.getDefaultStorage(userId).then((response: any) => {
            this.nzbCloudUsedSpace = response.usedSpace;
        });
    }

    /**
     * Check is user logged
     *
     * @returns {boolean}
     */
    public isLogged() {
        return GlobalServices.isLogged();
    }

    /**
     * Change Site Language
     *
     * @param language
     */
    public switchLanguage(language: string) {
        this.activeLanguage = language;
        const data: any     = {
            language: language
        };

        this.usersService.updateUserPersonalSettings(GlobalVariables.LOGGED_USER_ID, data);

        GlobalServices.setLanguage(language);
        this.translate.use(language);
    }
}
