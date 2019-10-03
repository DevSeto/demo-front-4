import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FilesService } from '../../services/component/files.service';
import { GlobalVariables } from '../../global.variables';

@Injectable()
export class UploadsResolve implements Resolve<any> {

    constructor(
        public filesService: FilesService
    ) {}

    public resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<any> {
        const self: any = this;
        return new Promise(function (resolve: any, reject: any) {
            if (GlobalVariables.LOGGED_USER_ID) {
                self.filesService.getNzbFiles(GlobalVariables.LOGGED_USER_ID).then((data: any) => {
                    if (data) {
                        resolve(data.files);
                    }
                });
            }
        });
    }
}
