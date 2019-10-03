import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { GlobalVariables } from '../../global.variables';
import { Router } from '@angular/router';
import { GlobalServices } from '../global/global.services';

@Injectable()
export class UsersService {
    public loginRemember: boolean;
    public usersRegisterUrl              = GlobalVariables.BACKEND_API_URL + '/auth';
    public changeUserActiveStatusUrl     = GlobalVariables.BACKEND_API_URL + '/auth/active-account/';
    public usersLoginUrl                 = GlobalVariables.BACKEND_API_URL + '/auth/login';
    public getUserUrl                    = GlobalVariables.BACKEND_API_URL + '/auth/get-user';
    public forgotPasswordUrl             = GlobalVariables.BACKEND_API_URL + '/auth/password/recovery';
    public changePasswordUrl             = GlobalVariables.BACKEND_API_URL + '/auth/password/change';
    public updateUserPersonalSettingsUrl = GlobalVariables.BACKEND_API_URL + '/users/update/';
    public usersInformationUrl           = GlobalVariables.BACKEND_API_URL + '/users/get/';
    public checkIfExistStorageUrl        = GlobalVariables.EXTERNAL_STORAGE_DOMAIN + '/user-storage/check-user-storage';
    public getUserStoragesUrl            = GlobalVariables.EXTERNAL_STORAGE_DOMAIN + '/user-storage/get-user-storages/';
    public getUserStorageSpaceUrl        = GlobalVariables.EXTERNAL_STORAGE_DOMAIN + '/{{storage}}/get-storage-space/';
    public deleteUserStorageUrl          = GlobalVariables.EXTERNAL_STORAGE_DOMAIN + '/user-storage/delete-user-storage';
    public setDefaultStorageUrl          = GlobalVariables.EXTERNAL_STORAGE_DOMAIN + '/user-storage/default-storage';

    constructor(
        public http   : Http,
        public router : Router
    ) {}

    /**
     * Create user
     *
     * @param registerUser
     * @returns {Promise<TResult|TResult2|TResult1>}
     */
    public registerUser(registerUser: any): Promise<any> {
        return this.http.post(this.usersRegisterUrl, JSON.stringify(registerUser), GlobalServices.requestHeader())
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Change user active status
     *
     * @param userId
     * @returns {Promise<TResult|TResult2|TResult1>}
     */
    public changeUserActiveStatus(userId: string): Promise<any> {
        return this.http.get(this.changeUserActiveStatusUrl + userId, GlobalServices.requestHeader())
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Login user
     *
     * @param loginUser
     * @returns {Promise<TResult|TResult2|TResult1>}
     */
    public loginUser(loginUser: any): Promise<any> {
        this.loginRemember = loginUser.remember;
        return this.http.post(this.usersLoginUrl, JSON.stringify(loginUser), GlobalServices.requestHeader())
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Get user
     *
     * @param id
     * @returns {Promise<TResult|TResult2|TResult1>}
     */
    public getUser(id: any): Promise<any> {
        return this.http.post(this.getUserUrl, JSON.stringify({user_id: id}), GlobalServices.requestHeader())
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Forgot user password
     *
     * @param user
     * @returns {Promise<TResult|TResult2|TResult1>}
     */
    public forgotPassword(user: any): Promise<any> {
        return this.http.post(this.forgotPasswordUrl, JSON.stringify(user), GlobalServices.requestHeader())
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Change user password
     *
     * @param user
     * @returns {Promise<TResult|TResult2|TResult1>}
     */
    public changeUserPassword(user: any): Promise<any> {
        return this.http.post(this.changePasswordUrl, JSON.stringify(user), GlobalServices.requestHeader())
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Update user personal settings
     *
     * @param userId
     * @param userData
     * @returns {Promise<TResult2|TResult1>}
     */
    public updateUserPersonalSettings(userId: any, userData: any): Promise<any> {
        return this.http.post(this.updateUserPersonalSettingsUrl + userId, JSON.stringify(userData), GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData);
    }

    /**
     * Get user by id
     *
     * @param UserData
     * @returns {Promise<TResult|TResult2|TResult1>}
     */
    public findById(UserData: any): Promise<any> {
        return this.http.get(this.usersInformationUrl + UserData.id, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Get user storages
     *
     * @param userId
     * @returns {Promise<TResult|TResult2|TResult1>}
     */
    public getUserStorages(userId: string): Promise<any> {
        return this.http.get(this.getUserStoragesUrl + userId, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Delete user storage
     *
     * @param userData
     * @returns {Promise<TResult>}
     */
    public deleteStorage(userData: any): Promise<any> {
        return this.http.post(this.deleteUserStorageUrl, JSON.stringify(userData), GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Get user storage space
     *
     * @param storage
     * @param userId
     */
    public getStorageSpace(storage: string, userId: string): Promise<any> {
        if (storage == 'gdrive') {
            storage = 'google-drive';
        }
        const getUserStorageSpaceUrl: string = this.getUserStorageSpaceUrl.replace('{{storage}}', storage);
        return this.http.get(getUserStorageSpaceUrl + userId, GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Check if exist storage
     *
     * @param userData
     * @returns {Promise<TResult>}
     */
    public checkIfExistStorage(userData: any): Promise<any> {
        return this.http.post(this.checkIfExistStorageUrl, JSON.stringify(userData), GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Set user external storage as default
     *
     * @param userData
     * @returns {Promise<TResult>}
     */
    public setDefaultStorage(userData: any): Promise<any> {
        return this.http.post(this.setDefaultStorageUrl, JSON.stringify(userData), GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise()
            .then(this.extractData)
            .catch((error: Response) => {
                return this.handleError(error, this.router);
            });
    }

    /**
     * Extract response data
     *
     * @param res
     * @returns {any|{}}
     */
    public extractData: any = (res: Response): any => {
        const body: any = res.json();
        if (!body.status) {
            return body || {};
        }

        if (body.auth_token) {
            GlobalServices.saveToken(body.auth_token);
            GlobalServices.setAuthTokenExpTime(this.loginRemember);
        }

        if (body.user) {
            localStorage.setItem('user', JSON.stringify(body.user));
        }

        return body || {};
    }

    /**
     * Logout user
     */
    public logoutUser() {
        sessionStorage.clear();
        localStorage.clear();
    }

    /**
     * Handle error
     *
     * @param error
     * @param router
     * @returns {any}
     */
    private handleError: any = (error: Response, router: Router): any => {
        GlobalServices.processErrorHandlers(error, router);
        return error.json();
    }
}
