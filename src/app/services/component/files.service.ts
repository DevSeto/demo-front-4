import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { GlobalVariables } from '../../global.variables';
import { Router } from '@angular/router';
import { GlobalServices } from '../global/global.services';

@Injectable()
export class FilesService {

    public uploadFileUrl: string           = GlobalVariables.BACKEND_API_URL + '/files/upload';
    public uploadNzbFileUrl: string        = GlobalVariables.BACKEND_API_URL + '/files/upload-nzb';
    public uploadNzbFileFromUrl: string    = GlobalVariables.BACKEND_API_URL + '/files/upload-nzb-by-url';
    public downloadNzbFilesUrl: string     = GlobalVariables.BACKEND_API_URL + '/files/download-nzb-files/';
    public updateNzbCloudUrl: string       = GlobalVariables.BACKEND_API_URL + '/files/update-nzb-storage';
    public getNzbFilesUrl: string          = GlobalVariables.BACKEND_API_URL + '/files/get-nzb-files/';
    public deleteNzbFileUrl: string        = GlobalVariables.BACKEND_API_URL + '/files/delete-nzb-file/';
    public checkIfFileHaveChildUrl: string = GlobalVariables.BACKEND_API_URL + '/files/check-file-child/';
    public deleteFileUrl: string           = GlobalVariables.BACKEND_API_URL + '/files/delete-file/';
    public lastDownloadsUrl: string        = GlobalVariables.BACKEND_API_URL + '/files/get-last-downloads/';
    public allDownloadsUrl: string         = GlobalVariables.BACKEND_API_URL + '/files/get-all-downloads/';
    public deleteLastDownloadsUrl: string  = GlobalVariables.BACKEND_API_URL + '/files/delete-last-downloads';
    public getFilesIdLink: string          = GlobalVariables.BACKEND_API_URL + '/files/get-files-id/';

    constructor(
        public http   : Http,
        public router : Router
    ) {}

    /**
     * Create nzb file
     *
     * @param file
     */
    public createFile(file: any): Promise<any> {
        return this.http.post(this.uploadNzbFileUrl, file, GlobalServices.requestHeader(GlobalServices.getToken(), 'file'))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Create nzb file from url
     *
     * @param file
     */
    public createFileFromUrl(file: any): Promise<any> {
        return this.http.post(this.uploadNzbFileFromUrl, file, GlobalServices.requestHeader(GlobalServices.getToken(), 'file'))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Get NZB files
     *
     * @param userId
     */
    public getNzbFiles(userId: string): Promise<any> {
        return this.http.get(this.getNzbFilesUrl + userId, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Delete NZB files
     *
     * @param id
     */
    public deleteNzbFile(id: string): Promise<any> {
        return this.http.get(this.deleteNzbFileUrl + id, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Check if file have child download
     *
     * @param id
     */
    public checkIfFileHaveChild(id: number): Promise<any> {
        return this.http.get(this.checkIfFileHaveChildUrl + id, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Delete file
     *
     * @param data
     */
    public deleteFile(data: any): Promise<any> {
        return this.http.post(this.deleteFileUrl, data, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    public uploadFile(file: any): Promise<any> {
        return this.http.post(this.uploadFileUrl, file, GlobalServices.requestHeader(GlobalServices.getToken(), 'file'))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Start donwloading files from nzbget server
     *
     * @param userId
     */
    public downloadNzbFiles(userId: string): Promise<any> {
        return this.http.get(this.downloadNzbFilesUrl + userId, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Update nzb cloud
     *
     * @param data
     */
    public updateNzbCloud(data: object): Promise<any> {
        return this.http.post(this.updateNzbCloudUrl, data, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Get last downloads
     *
     * @param userId
     */
    public getLastDownloads(userId: string): Promise<any> {
        return this.http.get(this.lastDownloadsUrl + userId, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Get last downloads
     *
     * @param userId
     */
    public getAllDownloads(userId: string): Promise<any> {
        return this.http.get(this.allDownloadsUrl + userId, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Delete Last downloads
     *
     * @param filesId
     */
    public deleteLastDownloads(filesId: any): Promise<any> {
        return this.http.post(this.deleteLastDownloadsUrl, filesId, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Get downloads files id
     *
     * @param userId
     */
    public getFilesId(userId: string): Promise<any> {
        return this.http.get(this.getFilesIdLink + userId, GlobalServices.requestHeader(GlobalServices.getToken()))
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
