import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FoldersService } from '../../../services/component/folders.service';
import { VideosService } from '../../../services/component/videos.service';
import { GlobalVariables } from '../../../global.variables';

@Injectable()
export class VideoPageResolve implements Resolve<any> {

    constructor(
        private videosService  : VideosService,
        private foldersService : FoldersService,
    ) {}

    public resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<any> {
        const self: any = this;
        return new Promise(function (resolve: any, reject: any) {
            if (GlobalVariables.LOGGED_USER_ID) {
                const videoId: string  = route.params.id;
                const folderId: string = route.queryParams.dir;
                const data: any        = {
                    file_id   : videoId,
                    folder_id : folderId
                };

                self.foldersService.getFile(data).then((res: any) => {
                    if (res.status) {
                        const videoId: string = res.file.hash ? res.file.hash : false;
                        if (videoId) {
                            self.videosService.getVideoInfo(videoId).then(function(videoInfo: any) {
                                const resolveData: any = {
                                    video      : res.file,
                                    video_info : videoInfo.video
                                };

                                resolve(resolveData);
                            });
                        } else {
                            const resolveData: any = {
                                video      : res.file,
                                video_info : []
                            };

                            resolve(resolveData);
                        }
                    }
                });
            }
        });
    }
}
