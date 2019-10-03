import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { GlobalServices } from '../global/global.services';
import { GlobalVariables } from '../../global.variables';


@Injectable()
export class UsenetService {

    public nzbgetUrl: string                  = 'http://localhost:6789/jsonrpc';
    public useneteServerCreateUrl: string     = GlobalVariables.BACKEND_API_URL + '/nzbget/usenet-server';
    public getUserUsenetServersUrl: string    = GlobalVariables.BACKEND_API_URL + '/nzbget/get-user-usenet-servers/';
    public deleteUserUsenetServersUrl: string = GlobalVariables.BACKEND_API_URL + '/nzbget/delete-usenet-server';
    public updateUserUsenetServersUrl: string = GlobalVariables.BACKEND_API_URL + '/nzbget/update-usenet-server/';

    constructor(
        private http   : Http,
        private router : Router
    ) {}

    /**
     * Create usenet server
     *
     * @param usenetData
     */
    public createUsenetServer(usenetData: any): Promise<any> {
        return this.http.post(this.useneteServerCreateUrl, JSON.stringify(usenetData), GlobalServices.requestHeader())
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });

    }

    /**
     * Update usenet server
     *
     * @param userId
     * @param usenetData
     */
    public updateUsenetServer(userId: string, usenetData: any): Promise<any> {
        return this.http.post(this.updateUserUsenetServersUrl + userId, JSON.stringify(usenetData), GlobalServices.requestHeader())
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });

    }

    /**
     * Get user usenet servers
     *
     * @param userId
     */
    public get(userId: string): Promise<any> {
        return this.http.get(this.getUserUsenetServersUrl + userId, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Test usenet connection
     *
     * @param data
     */
    public testUsenetServer(data: any): Promise<any> {
        return this.http.post(this.nzbgetUrl, JSON.stringify(data), GlobalServices.requestHeader())
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Delete usenet connection
     *
     * @param data
     */
    public deleteUsenetServer(data: any): Promise<any> {
        return this.http.post(this.deleteUserUsenetServersUrl, JSON.stringify(data), GlobalServices.requestHeader())
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
