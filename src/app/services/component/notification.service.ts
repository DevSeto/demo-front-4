import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalServices } from '../global/global.services';
import { GlobalVariables } from '../../global.variables';


@Injectable()
export class NotificationService {

    public userNotificationConfigUrl: any = GlobalVariables.BACKEND_API_URL + '/notifications/config';

    constructor(
        public http: Http
    ) {}

    /**
     * Save user browser push notification configuration
     *
     * @param notificationConfig
     */
    public create(notificationConfig: object): Promise<any> {
        return this.http.post(this.userNotificationConfigUrl, JSON.stringify(notificationConfig), GlobalServices.requestHeader(GlobalServices.getToken()))
            .toPromise();
    }
}
