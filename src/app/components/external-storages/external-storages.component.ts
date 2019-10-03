import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalVariables } from '../../global.variables';
import { StorageService } from '../../services/global/storage.service';

@Component({
    template: `<div></div>`
})

export class ExternalStoragesComponent implements OnInit {

    constructor(
        private storageService : StorageService,
        private activatedRoute : ActivatedRoute,
        private router         : Router,
        private renderer       : Renderer2
    ) {
        this.renderer.addClass(document.body, 'hide');
    }

    ngOnInit() {
        const storage: string = this.activatedRoute.snapshot.params.storage;

        if (storage == 'dropbox') {
            this.storeDropboxAccess();
        } else if (storage == 'google-drive') {
            this.storeGoogleDriveAccess();
        } else if (storage == 'onedrive') {
            this.storeOneDriveAccess();
        }
    }

    /**
     * Store Dropbox access
     */
    public storeDropboxAccess() {
        this.activatedRoute.fragment.subscribe((fragment: string) => {
            const token: string = fragment.match(/^(.*?)&/)[1].replace('access_token=', '');
            const userData: any = {
                user_id: GlobalVariables.LOGGED_USER_ID,
                access_token: token
            };

            this.storageService.storeDropboxToken(userData).then(() => {
                window.close();
            });
        });
    }

    /**
     * Store Google Drive access
     */
    public storeGoogleDriveAccess() {
        this.activatedRoute.queryParams.subscribe(params => {
            const code: string  = params['code'];
            const userData: any = {
                user_id : GlobalVariables.LOGGED_USER_ID,
                code    : code
            };

            this.storageService.storeGoogleDriveToken(userData).then(() => {
                window.close();
            });
        });
    }

    /**
     * Store OneDrive access
     */
    public storeOneDriveAccess() {
        this.activatedRoute.queryParams.subscribe(params => {
            const code: string  = params['code'];
            const userData: any = {
                user_id : GlobalVariables.LOGGED_USER_ID,
                code    : code
            };

            this.storageService.storeOneDriveToken(userData).then(() => {
                window.close();
            });
        });
    }

}
