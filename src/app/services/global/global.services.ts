import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { GlobalVariables } from '../../global.variables';

@Injectable()
export class GlobalServices {

    constructor(
        public router: Router
    ) {}

    /**
     * Get language
     *
     * @returns {boolean}
     */
    public static getLanguage() {
        if (!localStorage.hasOwnProperty('language')) {
            localStorage.setItem('language', GlobalVariables.LANGUAGE);
        }

        return localStorage.getItem('language');
    }

    /**
     * Set language
     *
     * @param language
     */
    public static setLanguage(language: string) {
        localStorage.setItem('language', language);
    }

    /**
     * Check if user logged
     *
     * @returns {boolean}
     */
    public static isLogged() {
        if ((localStorage.hasOwnProperty('auth_token')) && GlobalServices.isAuthTokenValid() && GlobalVariables.LOGGED_USER_ID) {
            return true;
        } else {
            sessionStorage.clear();
            localStorage.clear();
            return false;
        }
    }

    /**
     * Get user token
     *
     * @returns {string|null}
     */
    public static getToken() {
        return sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
    }

    /**
     * Header for request
     *
     * @param token
     * @param type
     * @returns {{headers: any}}
     */
    public static requestHeader(token: string = '', type: any = ''): any {
        const params: Object = {};
        if (type && type !== 'file') {
            params['Content-Type'] = type;
        } else if (type !== 'file') {
            params['Content-Type'] = 'application/json';
        }

        if (token) {
            params['Authorization'] = token;
        }

        const headers: any = new Headers(params);

        return {
            headers: headers
        };
    }

    /**
     * Save authentication token
     *
     * @param token
     */
    public static saveToken(token: string) {
        if (token) {
            localStorage.setItem('auth_token', token.replace('Bearer ', ''));
        }
    }

    /**
     * Add minute to date
     * @param date
     * @param minutes
     */
    public static addMinutes(date: Date, minutes: number): Date {
        return new Date(date.getTime() + minutes * 60000);
    }

    /**
     * Update user storage item
     *
     * @param key
     * @param value
     */
    public static updateUserStorage(key: string, value: any) {
        let user: any = localStorage.getItem('user');
        user[key]     = value;
        localStorage.setItem('user', user);
    }

    /**
     * Cache property
     *
     * @param propertyName
     * @param timeInMinutes
     * @param storedData
     */
    public static cacheProperty(propertyName: string, timeInMinutes: number, storedData: any) {
        let data: any = storedData;

        if (typeof(storedData) === 'object') {
            data = JSON.stringify(storedData);
        }

        localStorage.setItem(propertyName, data);

        localStorage.setItem(propertyName + '-expiredAt', JSON.stringify(GlobalServices.addMinutes(new Date(), timeInMinutes).getTime()));
    }

    /**
     * Check if property is expired
     *
     * @param propertyName
     */
    public static isPropertyExpired(propertyName: string) {
        const property: any = (propertyName.indexOf('-expiredAt') == -1) ? propertyName + '-expiredAt' : propertyName;

        if (!localStorage.hasOwnProperty(property)) {
            return true;
        }

        const propertyExpTime: Date = new Date(+localStorage.getItem(property));

        if ((new Date().getTime()) > propertyExpTime.getTime()) {
            return true;
        }

        return false;
    }

    /**
     * Check if cache is valid
     *
     * @param property
     */
    public static isCachedPropertyValid(property: string) {
        if (localStorage.hasOwnProperty(property) && !GlobalServices.isPropertyExpired(property)) {
            return true;
        }

        return false;
    }

    /**
     * Set token expire
     *
     * @param remember
     */
    public static setAuthTokenExpTime(remember) {
        let tokenExpire: number = 14400;

        if (remember) {
            tokenExpire = 1440 * 7;
        }

        GlobalServices.cacheProperty('auth_token_exp', tokenExpire, '1');
    }

    /**
     * Check if token valid
     */
    public static isAuthTokenValid() {
        return GlobalServices.isCachedPropertyValid('auth_token_exp');
    }

    /**
     * Error Handler
     *
     * @param error
     * @param router
     */
    public static processErrorHandlers(error: Response, router?: Router) {
        GlobalServices.checkUserAuthorization(error, router);

        GlobalServices.check500ServerError(error, router);
    }


    /**
     * Check user authorization
     *
     * @param error
     * @param router
     */
    public static checkUserAuthorization(error: Response, router: Router) {
        if (error.status == 401) {
            window.location.href = '/logout';
        }
    }

    /**
     * Check server error
     *
     * @param error
     * @param router
     */
    public static check500ServerError(error: Response, router: Router) {
        if (error.status == 500 || error.status == 404) {
            router.navigate(['/error-page', error.status]);
        }
    }
}
