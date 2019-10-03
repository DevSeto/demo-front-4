import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FilesService } from '../../../services/component/files.service';
import { SocketService } from '../../../services/websocket/socket.service';
import { GlobalVariables } from '../../../global.variables';
import { GlobalServices } from '../../../services/global/global.services';

@Injectable()
export class ActiveDownloadingResolve implements Resolve<any> {

    public cloudFiles: any = [];

    constructor(
        public filesService : FilesService,
        public socket       : SocketService
    ) {}

    public resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<any> {
        if (GlobalServices.isLogged()) {
            if (!this.socket.socket) {
                this.socket.initSocket();
            }

            const self: any = this;
            return new Promise(function (resolve: any, reject: any) {
                self.filesService.getFilesId(GlobalVariables.LOGGED_USER_ID).then((data: any) => {
                    if (data.status) {
                        const userId: string = data.a_d_user_id ? data.a_d_user_id : GlobalVariables.LOGGED_USER_ID;
                        const nzbData: any   = {
                            files   : data.files,
                            user_id : userId
                        };

                        if (data.files.length) {
                            self.socket.send('pass-data', nzbData);
                        }

                        self.socket.onMessage('cloud-files').subscribe(function (cloudFiles: any) {
                            if (cloudFiles.length) {
                                self.cloudFiles = cloudFiles;
                            } else {
                                self.cloudFiles = [];
                            }
                        });
                    }

                    setTimeout(function() {
                        resolve(self.cloudFiles);
                    }, 1000);
                });
            });
        }
    }
}
