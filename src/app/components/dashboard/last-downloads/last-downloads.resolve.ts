import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FilesService } from '../../../services/component/files.service';
import { GlobalVariables } from '../../../global.variables';
import { GlobalServices } from '../../../services/global/global.services';

@Injectable()
export class LastDownloadsResolve implements Resolve<any> {

    public foldersId: any     = [];
    public lastDownloads: any = [];

    constructor(
        public filesService: FilesService,
    ) {}

    public resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<any> {
        if (GlobalServices.isLogged()) {
            const self: any       = this;
            self.foldersId        = [];
            self.lastDownloads    = [];
            let resaolveData: any = {
                lastDownloads : [],
                foldersId     : []
            };

            return new Promise(function (resolve: any, reject: any) {
                self.filesService.getLastDownloads(GlobalVariables.LOGGED_USER_ID).then((data: any) => {
                    if (data.last_downloads) {
                        self.lastDownloads = [];
                        data.last_downloads.forEach(function(download: any, index: number) {
                            ++index;
                            const fileId: string = download._id;
                            if (!self.foldersId[fileId]) {
                                self.foldersId[fileId] = false;
                            }

                            download.id = index;
                            self.lastDownloads.push(download);
                        });

                        resaolveData = {
                            lastDownloads : self.lastDownloads,
                            foldersId     : self.foldersId
                        };
                    }

                    resolve(resaolveData);
                });
            });
        }
    }
}
