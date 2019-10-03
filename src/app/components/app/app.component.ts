import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../services/component/notification.service';
import { GlobalServices } from '../../services/global/global.services';
import { GlobalVariables } from '../../global.variables';
import { SocketService } from '../../services/websocket/socket.service';
import { GlobalConfig } from '../../configs/global.config';

@Component({
    selector: 'my-app',
    templateUrl: '../../html/app/app.component.html'
})

export class AppComponent implements OnInit {

    public authenticationUrls: any = [
        '/login',
        '/sign-up',
        '/logout',
        '/password/recovery',
        '/password-recovery/',
        '/active-account/'
    ];

    constructor(
        private translate           : TranslateService,
        private router              : Router,
        private socket              : SocketService,
        private notificationService : NotificationService,
    ) {
        router.events.subscribe( (event: Event) => {
            if (event instanceof NavigationEnd) {
                translate.use(GlobalServices.getLanguage());
            }
        });
    }

    ngOnInit() {
        this.translate.setDefaultLang(GlobalConfig.language);

        if (GlobalServices.isLogged()) {
            if (!this.socket.socket) {
                this.socket.initSocket();
            }

            this.pushNotification();
        } else {
            if (this.isNotAuthPage() && !this.checkIfTermsPage()) {
                return this.router.navigate(['/login']);
            }
        }
    }

    /**
     * Check if pages is terms or privacy
     */
    public checkIfTermsPage() {
        const currentUrl: string = window.location.href;

        if(currentUrl.indexOf('terms-of-use') > -1 || currentUrl.indexOf('privacy-policy') > -1) {
            return true;
        }

        return  false;
    }

    /**
     * Check is user logged
     */
    public isNotAuthPage() {
        let checkUrl: boolean    = true;
        const currentUrl: string = window.location.href;

        this.authenticationUrls.forEach(function(url: string) {
            if (currentUrl.indexOf(url) > -1) {
                checkUrl = false;
            }
        });

        return checkUrl;
    }

    /**
     * Web Push Notification
     */
    public pushNotification() {
        const userId: any              = GlobalVariables.LOGGED_USER_ID;
        const notificationService: any = this.notificationService;

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js');
        }

        function buildApplicationServerKey() {
            const base64: string  = 'BE8PyI95I_jBIfb_LTS_nkUJnOwjLP2zAaGBSFEi3jmFJ3l5ox7-NtNqrVuyPL4Qmt4UxDI-YgwYI1sEMIpoU90=';
            const rfc4648: string = base64.replace(/-/g, '+').replace(/_/g, '/');
            const characters: any = atob(rfc4648).split('').map(character => character.charCodeAt(0));
            return new Uint8Array(characters);
        }

        function sendSubscriptionToServer(userId: string, subscription: any) {
            const userNotification: any = {
                user_id             : userId,
                notification_config : subscription.toJSON()
            };

            notificationService.create(userNotification);
        }

        function permissionGranted(userId: string) {
            navigator.serviceWorker.ready.then((serviceWorkerRegistration: any) => {
                serviceWorkerRegistration.pushManager.subscribe({
                    userVisibleOnly      : true,
                    applicationServerKey : buildApplicationServerKey(),
                }).then((subscription: any) => {
                    sendSubscriptionToServer(userId, subscription);
                });
            });
        }

        Notification.requestPermission().then((result: any) => {
            if (result !== 'granted') {
                return;
            }
            permissionGranted(userId);
        });

    }
}
