import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ChangesService {

    private upload: any      = new BehaviorSubject(false);
    uploadChange = this.upload.asObservable();

    constructor() { }

    public triggerUpload(data: boolean) {
        this.upload.next(data)
    }

}
