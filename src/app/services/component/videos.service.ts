import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { GlobalVariables } from '../../global.variables';
import { Router } from '@angular/router';
import { GlobalServices } from '../global/global.services';

@Injectable()
export class VideosService {

    public getVideoInfoUrl: string = GlobalVariables.BACKEND_API_URL + '/video-hook/get-video-info/';

    constructor(
        public http   : Http,
        public router : Router
    ) {}

    /**
     * Get NZB files
     *
     * @param userId
     */
    public getVideoInfo(videoId: string): Promise<any> {
        return this.http.get(this.getVideoInfoUrl + videoId, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Extract data from response
     *
     * @param res
     */
    public extractData: any = (res: Response): any => {
        const body: any = res.json();
        if (!body.status) {
            return body || {};
        }

        return body || {};
    }

    /**
     * Handle error
     * @param error
     * @param router
     */
    private handleError: any = (error: Response, router: Router): any => {
        GlobalServices.processErrorHandlers(error, router);
        return error.json();
    }
}
