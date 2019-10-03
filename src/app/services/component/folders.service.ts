import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { GlobalVariables } from '../../global.variables';
import { Router } from '@angular/router';
import { GlobalServices } from '../global/global.services';

@Injectable()
export class FoldersService {

    public getFoldersUrl: string           = GlobalVariables.BACKEND_API_URL + '/folders/get';
    public getFileDataUrl: string          = GlobalVariables.BACKEND_API_URL + '/folders/get-file';
    public deleteFolderUrl: string         = GlobalVariables.BACKEND_API_URL + '/folders/delete-folder';
    public getNzbCloudUsedSpaceUrl: string = GlobalVariables.BACKEND_API_URL + '/folders/get-nzbcloud-used-space/';
    public getNotOpenedCountUrl: string    = GlobalVariables.BACKEND_API_URL + '/folders/get-not-opened-count/';
    public getDefaultStorageUrl: string    = GlobalVariables.EXTERNAL_STORAGE_DOMAIN + '/user-storage/get-user-default-storage/';
    public generateDownloadLinkUrl: string = GlobalVariables.EXTERNAL_STORAGE_DOMAIN + '/{{storage}}/get-file-link';

    constructor(
        public http   : Http,
        public router : Router
    ) {}

    /**
     * Get Folders
     *
     * @param folderData
     */
    public getFolders(folderData: any): Promise<any> {
        return this.http.post(this.getFoldersUrl, folderData, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Delete Folder
     *
     * @param userData
     */
    public deleteFolder(folderData: any): Promise<any> {
        return this.http.post(this.deleteFolderUrl, folderData, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Get file data
     *
     * @param fileId
     */
    public getFile(fileId: string): Promise<any> {
        return this.http.post(this.getFileDataUrl, fileId, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Get user nzbcloud storage used space
     *
     * @param userId
     */
    public getNzbCloudUsedSpace(userId: string): Promise<any> {
        return this.http.get(this.getNzbCloudUsedSpaceUrl + userId, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Get not opened folder count by user id
     *
     * @param userId
     */
    public getNotOpenedCount(userId: string): Promise<any> {
        return this.http.get(this.getNotOpenedCountUrl + userId, GlobalServices.requestHeader(GlobalServices.getToken()))
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
     * Get file url
     *
     * @param filePath
     * @param cloudType
     */
    public getFileUrl(filePath: any, cloudType: string, userId: string): Promise<any> {
        const downloadUrl: string = this.generateDownloadLinkUrl.replace('{{storage}}', cloudType);
        const data: object        = {
            file_id: filePath,
            user_id: userId,
        };

        return this.http.post(downloadUrl, data, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Get user external storage as default
     *
     * @param userData
     * @returns {Promise<TResult>}
     */
    public getDefaultStorage(userId: string): Promise<any> {
        return this.http.get(this.getNzbCloudUsedSpaceUrl + userId, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
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
