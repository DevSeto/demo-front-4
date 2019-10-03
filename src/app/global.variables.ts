import { GlobalConfig } from './configs/global.config';

export class GlobalVariables {

    /**
     * Get storage domain
     *
     * @returns {string}
     * @constructor
     */
    public static get EXTERNAL_STORAGE_DOMAIN(): string {
        if (GlobalConfig.production) {
            return GlobalConfig.external_storage_domain + ':' + GlobalConfig.external_storage_domain_port;
        }
        return GlobalConfig.dev_external_storage_domain + ':' + GlobalConfig.dev_external_storage_domain_port;
    }

    /**
     * Get backend domain
     *
     * @returns {string}
     * @constructor
     */
    public static get BACKEND_DOMAIN(): string {
        if (GlobalConfig.production) {
            return GlobalConfig.backend_domain + ':' + GlobalConfig.backend_domain_port;
        }
        return GlobalConfig.dev_backend_domain + ':' + GlobalConfig.dev_backend_domain_port;
    }

    /**
     * Get backend url
     *
     * @returns {string}
     * @constructor
     */
    public static get BACKEND_API_URL(): string {
        return this.BACKEND_DOMAIN + '/api';
    }

    /**
     * Get user data
     *
     * @returns {any}
     * @constructor
     */
    public static get USER(): any {
        return JSON.parse(localStorage.getItem('user'));
    }

    /**
     * Get user data
     *
     * @returns {any}
     * @constructor
     */
    public static get LANGUAGE(): any {
        return this.USER ? this.USER.language : GlobalConfig.language;
    }

    /**
     * Get user id
     *
     * @constructor
     */
    public static get LOGGED_USER_ID(): any {
        return this.USER._id;
    }

    /**
     * Constants of video converting status
     */
    public static VIDEO_CONVERTING_STATUS: any = {
        StatusConvertingError   : 0,
        StatusNotConverted      : 1,
        StatusConverting        : 2,
        StatusConverted         : 3,
        StatusPreparing         : 4,
        StatusProbing           : 5,
        StatusUploading         : 6,
        StatusUploadFailed      : 7,
        StatusUploaded          : 8,
    };
}
