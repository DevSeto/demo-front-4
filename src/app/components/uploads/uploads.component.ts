import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { UsersService } from '../../services/component/users.service';
import { FilesService } from '../../services/component/files.service';
import { GlobalServices } from '../../services/global/global.services';
import { GlobalVariables } from '../../global.variables';
import { TitleService } from '../../services/global/title.service';

@Component({
    templateUrl: '../../html/uploads/uploads.component.html',
    styleUrls: ['../../css/uploads.component.css']
})

export class UploadsComponent implements OnInit {

    @ViewChild('storageModalTmpl') storageModalTmpl: ModalDirective;

    public userId: string;
    public fileId: string;
    public deletedId: string;
    public uploads: any          = [];
    public activeCloud: string   = 's3';
    public externalStorages: any = {
        gdrive   : false,
        dropbox  : false,
        onedrive : false
    };

    constructor(
        private router       : Router,
        private route        : ActivatedRoute,
        private filesService : FilesService,
        private usersService : UsersService,
        private titleService : TitleService
    ) {
        const self: any = this;
        this.userId     = GlobalVariables.LOGGED_USER_ID;

        if (this.router.url == '/uploads?refresh=true') {
            this.router.navigate(['/uploads']);
        }

        if (this.route.snapshot.data['uploads']) {
            this.uploads = this.route.snapshot.data['uploads'];
        }

        const subscribe: any = this.route.queryParams.subscribe(params => {
            if (GlobalServices.isLogged()) {
                return self.getUploads();
            }

            if (subscribe) {
                subscribe.unsubscribe();
            }
        });
    }

    ngOnInit() {
        this.titleService.setPageTitle('uploads.page_title');
        this.getUserExternalStorages();
    }

    /**
     * Get user external storages
     */
    public getUserExternalStorages() {
        const self: any = this;
        this.usersService.getUserStorages(GlobalVariables.LOGGED_USER_ID).then((data: any) => {
            if (data.status) {
                data.user_storages.forEach(item => {
                    const storage: any = item.storage_type;
                    self.externalStorages[storage] = true;
                });
            }
        });
    }

    /**
     * Get user nzb files
     */
    public getUploads() {
        if (!this.userId) {
            return false;
        }

        this.filesService.getNzbFiles(this.userId).then((data: any) => {
            if (data) {
                this.uploads = data.files;
            }
        });
    }

    /**
     * Open Cloud Modal
     *
     * @param fileId
     * @param cloud
     */
    public chooseFolderModal(fileId: string, cloud: string) {
        this.fileId = fileId;
        this.activeCloud = cloud;

        this.storageModalTmpl.show();
    }

    /**
     * Delete user nzb file by id
     *
     * @param id
     */
    public deleteNzbFile(id: string) {
        this.deletedId = id;

        this.filesService.deleteNzbFile(id).then(() => {
            setTimeout(() => {
                this.uploads = this.uploads.filter( function(upload: any) {
                    return upload._id !== id;
                });
            }, 500);
        });
    }

    /**
     * Download nzb files
     */
    public downloadNzbFiles() {
        const self: any = this;
        this.filesService.downloadNzbFiles(this.userId).then((data: any) => {
            if (data.status) {
                setTimeout(function () {
                    self.router.navigate(['/']);
                }, 500);
            }
        });
    }

    /**
     * Change nzb file cloud
     */
    public changeCloud() {
        const data: object = {
            file_id : this.fileId,
            cloud   : this.activeCloud
        };

        this.filesService.updateNzbCloud(data).then((data: any) => {
            if (data.status) {
                const uploadKey: number = this.getKey(this.fileId);
                this.uploads[uploadKey].cloud = this.activeCloud;
                this.storageModalTmpl.hide();
            }
        });
    }

    /**
     * Get key by id
     *
     * @param id
     */
    public getKey(id: string) {
        const countOfUploads: number = this.uploads.length;

        for (let i = 0; i < countOfUploads; i++) {
            if (this.uploads[i]._id == id) { return i; }
        }
    }
}
