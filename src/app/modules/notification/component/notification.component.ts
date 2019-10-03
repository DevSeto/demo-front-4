import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActiveDownloadingComponent } from '../../../components/dashboard/active-downloading/active-downloading.component';
import { GlobalServices } from '../../../services/global/global.services';
import { FilesService } from '../../../services/component/files.service';
import { GlobalVariables } from '../../../global.variables';
import { _ } from '../../../services/helpers/helper.service';

@Component({
    selector: 'notification',
    templateUrl: '../html/notification.component.html',
    styleUrls: ['../css/notification.component.css'],
    providers: [ActiveDownloadingComponent]
})

export class NotificationComponent {

    public helper: any;
    public userId: string;
    public countOfSelected: boolean;
    public foldersId: any        = [];
    public isAllChecked: boolean = false;
    public lastDownloads: any    = [];

    constructor(
        private route           : ActivatedRoute,
        private filesService    : FilesService,
        private activeDownloads : ActiveDownloadingComponent
    ) {
        if (GlobalServices.isLogged()) {
            const self: any = this;
            this.helper     = new _();
            this.userId     = GlobalVariables.LOGGED_USER_ID;

            this.getLastDownloads();

            this.activeDownloads.lastDownloadsUpdated.subscribe(function() {
                self.getLastDownloads();
            });
        }
    }

    /**
     * Get last 4 downloads
     */
    public getLastDownloads() {
        const self: any          = this;
        const lastDownloads: any = [];

        this.filesService.getLastDownloads(self.userId).then((data: any) => {
            if (data.last_downloads) {
                self.lastDownloads = data.last_downloads;
                data.last_downloads.forEach(function(folder: any, index: number) {
                    ++index;
                    const fileId: string = folder._id;
                    if (!self.foldersId[fileId]) {
                        self.foldersId[fileId] = false;
                    }

                    const download: any = folder;
                    download.id = index;
                    lastDownloads.push(download);
                });

                self.lastDownloads = lastDownloads;
            }
        });
    }
}
