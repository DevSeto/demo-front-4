import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalServices } from '../../../services/global/global.services';
import { FilesService } from '../../../services/component/files.service';
import { SocketService } from '../../../services/websocket/socket.service';
import { ChangesService } from '../../../services/global/changes.service';
import { GlobalVariables } from '../../../global.variables';

@Component({
    selector: 'active-downloading',
    templateUrl: '../../../html/dashboard/active-downloading.component.html'
})

export class ActiveDownloadingComponent implements OnInit{

    @Output()
    public lastDownloadsUpdated: any = new EventEmitter();

    @Output()
    public userUsedSpaceUpdated: any = new EventEmitter();

    public userId: string;
    public cloudFiles: any       = [];
    public nzbIds: any           = [];
    public downloadList: boolean = true;
    public destroy: boolean      = false;

    constructor(
        private route        : ActivatedRoute,
        private filesService : FilesService,
        private socket       : SocketService,
        private changes      : ChangesService
    ) {
        if (GlobalServices.isLogged()) {
            this.userId = GlobalVariables.LOGGED_USER_ID;

            if (this.route.snapshot.data['downloads'] && this.route.snapshot.data['downloads'].length) {
                this.cloudFiles   = this.route.snapshot.data['downloads'];
                this.downloadList = false;
            }

        }
    }

    ngOnInit() {
        this.lastDownloadsUpdated.emit(true);
        this.getFilesId();
        this.getActiveDownloadsList();
    }

    ngOnDestroy() {
        this.destroy = !this.destroy;
    }

    public checkIfHaveParent(id: string) {
        if(this.nzbIds[id]) {
            return false;
        }

        return true;
    }

    /**
     * Get donwload data
     */
    public getFilesId() {
        if(!this.destroy) {
            this.filesService.getFilesId(this.userId).then((data: any) => {
                if (data.files.length) {
                    const userId: string = data.a_d_user_id ? data.a_d_user_id : this.userId;
                    const nzbData: any   = {
                        files   : data.files,
                        user_id : userId
                    };

                    this.socket.send('pass-data', nzbData);

                    data.files.forEach((file: any) => {
                        this.nzbIds[file.nzb_file_id] = file.a_d_user_id
                    });

                    setTimeout(() => {
                        return this.getFilesId();
                    }, 1024);
                }
            });
        }
    }

    /**
     * Get active downloaded files list
     */
    public async getActiveDownloadsList() {
        const self: any = this;

        self.socket.onMessage('failure').subscribe(function (data: any) {
            if(self.cloudFiles.length >= 0) {
                const index: any = self.cloudFiles.map(function (item: any) { return item.id; }).indexOf(data.id);
                self.cloudFiles.splice(index, 1);
            }

            setTimeout(function() {
                self.changes.triggerUpload(true);
            }, 3000);
        });

        self.socket.onMessage('finish').subscribe(function (data: any) {
            if(self.cloudFiles.length == 1) {
                const index: any = self.cloudFiles.map(function (item: any) { return item.id; }).indexOf(data.id);
                self.cloudFiles.splice(index, 1);
            }

            setTimeout(function() {
                self.changes.triggerUpload(true);
            }, 3000);
        });

        self.socket.onMessage('cloud-files').subscribe(function (cloudFiles: any) {
            if (Object.keys(cloudFiles).length) {
                self.downloadList = false;
                self.cloudFiles   = cloudFiles;
            } else {
                self.cloudFiles = [];
            }
        });
    }

    /**
     * Pause or delete file
     *
     * @param fileId
     * @param command
     */
    public editNzb(fileId: number, command: string) {
        const self: any   = this;
        const params: any = [
            command,
            this.userId,
            [fileId]
        ];

        function getNzbById(nzbId) {
            return self.cloudFiles.filter(
                function(data) { return data.id != nzbId; }
            );
        }

        if (command == 'GroupFinalDelete') {
            this.cloudFiles = getNzbById(fileId);
        }

        this.filesService.checkIfFileHaveChild(fileId).then((file: any) => {
            if(!file.check) {
                this.socket.send('edit-queued', params);
            } else {
                this.socket.send('delete-for-me', params);
            }

            if (command == 'GroupFinalDelete') {
                const data: any = {
                    user_id : this.userId,
                    id      : fileId
                };

                this.filesService.deleteFile(data);
            }
        });
    }

    /**
     * Track row by download id
     *
     * @param index
     * @param download
     */
    public trackByItemId(index: number, download: any) {
        return download.id;
    }
}
