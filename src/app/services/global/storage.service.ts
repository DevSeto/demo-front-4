import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { GlobalVariables } from '../../global.variables';
import { Router } from '@angular/router';
import { GlobalServices } from './global.services';


@Injectable()
export class StorageService {
    public getCloudAuthUrl          = GlobalVariables.EXTERNAL_STORAGE_DOMAIN + '/{{cloud}}/generate-auth-url';
    public storeGoogleDriveTokenUrl = GlobalVariables.EXTERNAL_STORAGE_DOMAIN + '/google-drive/store-access';
    public storeOneDriveTokenUrl    = GlobalVariables.EXTERNAL_STORAGE_DOMAIN + '/onedrive/store-access';
    public storeDropboxTokenUrl     = GlobalVariables.EXTERNAL_STORAGE_DOMAIN + '/dropbox/store-access';
    public storeBoxTokenUrl         = GlobalVariables.EXTERNAL_STORAGE_DOMAIN + '/box/store-access';
    public addUsenetServerUrl       = GlobalVariables.BACKEND_API_URL + '/nzbget/usenet-server';
    public editUsenetServerUrl      = GlobalVariables.BACKEND_API_URL + '/nzbget/edit-usenet-server/';
    public deleteUsenetServerUrl    = GlobalVariables.BACKEND_API_URL + '/nzbget/delete-usenet-server';
    public getUsenetServersUrl      = GlobalVariables.BACKEND_API_URL + '/nzbget/get-user-usenet-servers/';

    constructor(
        private http   : Http,
        private router : Router
    ) {}

    /**
     * Get cloud authorization url
     *
     * @param cloud
     */
    public getCloudAuth(cloud: string): Promise<any> {
        const cloudUrl: string = this.getCloudAuthUrl;
        return this.http.get(cloudUrl.replace('{{cloud}}', cloud), GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Store Google Drive configuration
     *
     * @param configuration
     */
    public storeGoogleDriveToken(configuration: any): Promise<any> {
        return this.http.post(this.storeGoogleDriveTokenUrl, configuration, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }


    /**
     * Store OneDrive configuration
     *
     * @param configuration
     */
    public storeOneDriveToken(configuration: any): Promise<any> {
        return this.http.post(this.storeOneDriveTokenUrl, configuration, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }


    /**
     * Store Dropbox configuration
     *
     * @param configuration
     */
    public storeDropboxToken(configuration: any): Promise<any> {
        return this.http.post(this.storeDropboxTokenUrl, configuration, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }


    /**
     * Store Box configuration
     configuration
     * @param userData
     */
    public storeBoxToken(configuration: any): Promise<any> {
        return this.http.post(this.storeBoxTokenUrl, configuration, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Add user usenet server
     *
     * @param usenetServer
     */
    public addUsenetServer(usenetServer: object): Promise<any> {
        return this.http.post(this.addUsenetServerUrl, usenetServer, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Edit user usenet server
     *
     * @param usenetServerId
     * @param usenetServer
     */
    public editUsenetServer(usenetServerId: string, usenetServer: object): Promise<any> {
        return this.http.post(this.editUsenetServerUrl + usenetServerId, usenetServer, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Delete user usenet server
     *
     * @param usenetServersId
     */
    public deleteUsenetServer(usenetServersId: object): Promise<any> {
        return this.http.post(this.deleteUsenetServerUrl, usenetServersId, GlobalServices.requestHeader(GlobalServices.getToken()))
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
    public get(userId: any): Promise<any> {
        return this.http.get(this.getUsenetServersUrl + userId, GlobalServices.requestHeader(GlobalServices.getToken()))
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
        const body = res.json();
        if (!body.status) {
            return body || {};
        }

        return body || {};
    }

    /**
     * Handle Error
     *
     * @param error
     * @param router
     */
    private handleError: any = (error: Response, router: Router): any => {
        GlobalServices.processErrorHandlers(error, router);
        return error.json();
    }
}
