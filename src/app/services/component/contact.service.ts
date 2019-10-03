import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalServices } from '../global/global.services';
import { GlobalVariables } from '../../global.variables';


@Injectable()
export class ContactService {

    public contactUsUrl: any = GlobalVariables.BACKEND_API_URL + '/contact-us';

    constructor(
        public http: HttpClient
    ) {}

    /**
     * Send data from contact form
     *
     * @param contactFormData
     */
    public send(contactFormData: object): Promise<any> {
        return this.http.post(this.contactUsUrl, JSON.stringify(contactFormData), GlobalServices.requestHeader())
            .toPromise();
    }
}
