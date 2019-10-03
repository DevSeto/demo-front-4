import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChangesService } from '../../../services/global/changes.service';
import { GlobalServices } from '../../../services/global/global.services';
import { FilesService } from '../../../services/component/files.service';
import { ModalModule, ModalDirective, WavesModule, InputsModule, ButtonsModule } from 'angular-bootstrap-md'
import { GlobalVariables } from '../../../global.variables';
import { _ } from '../../../services/helpers/helper.service';

@Component({
    selector: 'last-downloads',
    templateUrl: '../../../html/dashboard/last-downloads.component.html'
})

export class LastDownloadsComponent {

    @ViewChild('deleteModalTmpl') deleteModalTmpl: ModalDirective;

    public helper: any;
    public userId: string;
    public folderId: string;
    public deletedId: string;
    public countOfDownloads: number;
    public allDownloadsActive: boolean = false;
    public lastDownloads: any          = [];

    constructor(
        private route        : ActivatedRoute,
        private filesService : FilesService,
        private translate    : TranslateService,
        private changes      : ChangesService
    ) {
        if (GlobalServices.isLogged()) {
            const self: any = this;
            this.helper     = new _();
            this.userId     = GlobalVariables.LOGGED_USER_ID;

            if (this.route.snapshot.data['last_downloads']) {
                this.lastDownloads = this.route.snapshot.data['last_downloads'].lastDownloads;
            }

            this.getLastDownloads();

            this.changes.uploadChange.subscribe(() => {
                if(this.allDownloadsActive) {
                    this.getAllDownloads();
                } else {
                    this.getLastDownloads();
                }
            });
        }
    }

    /**
     * Open delete Modal
     *
     * @param fileId
     */
    public deleteModal(fileId: string = '') {
        this.deleteModalTmpl.show();

        if (fileId !== '') {
            this.folderId = fileId;
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
                self.countOfDownloads = data.count;
                self.lastDownloads    = data.last_downloads;

                data.last_downloads.forEach(function(folder: any, index: number) {
                    ++index;
                    const download: any = folder;
                    download.id = index;
                    lastDownloads.push(download);
                });

                self.lastDownloads = lastDownloads;
            }
        });
    }

    /**
     * Delete folder
     *
     */
    public deleteFolder() {
        this.deleteModalTmpl.hide();

        const folderId: string = this.folderId;
        this.deletedId         = folderId;

        this.filesService.deleteLastDownloads({folder_id : this.folderId}).then((data: any) => {
            if (data.status) {
                setTimeout(() => {
                    this.lastDownloads = this.lastDownloads.filter(function(download: any) {
                        return download._id !== folderId;
                    });
                }, 500);
            }
        });
    }

    /**
     * Get user all downloads
     */
    public getAllDownloads() {
        const lastDownloads: any = [];
        this.filesService.getAllDownloads(this.userId).then((data: any) => {
            if (data.last_downloads) {
                this.lastDownloads = data.last_downloads;

                data.last_downloads.forEach(function (folder: any, index: number) {
                    ++index;
                    const download: any = folder;
                    download.id = index;
                    lastDownloads.push(download);
                });

                this.allDownloadsActive = true
                this.lastDownloads      = lastDownloads;
            }
        });
    }

    /**
     * Track row by download id
     * @param index
     * @param download
     */
    public trackByItemId(index: number, download: any) {
        return download.id;
    }
}
