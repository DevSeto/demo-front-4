/**************************** Common Section *******************************/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/************************** End Common Section *****************************/

/**************************** Auth Section *********************************/
import { LoginComponent } from './components/auth/login/login.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './components/auth/change-password/change-password.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { UserActivationComponent } from './components/auth/user-activation/user-activation.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ActiveDownloadingResolve } from './components/dashboard/active-downloading/active-downloading.resolve';
import { LastDownloadsResolve } from './components/dashboard/last-downloads/last-downloads.resolve';

import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsComponent } from './components/terms/terms.component';
import { HelpComponent } from './components/help/help.component';
import { ContactComponent } from './components/contact/contact.component';

import { NotFoundComponent } from './components/error-404/error-404.component';
/************************** End Auth Section ********************************/

/*************************** Storage Section ********************************/
import { ExternalStoragesComponent } from './components/external-storages/external-storages.component';
/*************************** End Storage Section ****************************/

import { SettingsComponent } from './components/settings/settings.component';
import { UserPlanComponent } from './components/user-plan/user-plan.component';
import { FilesComponent } from './components/files/files.component';
import { VideoPageComponent } from './components/files/video-page/video-page.component';
import { VideoPageResolve } from './components/files/video-page/video-page.resolve';
import { UploadsComponent } from './components/uploads/uploads.component';
import { UploadsResolve } from './components/uploads/uploads.resolve';

const APP_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path      : 'logout',
        component : LogoutComponent
    },
    {
        path      : 'password/recovery',
        component : ForgotPasswordComponent
    },
    {
        path      : 'sign-up',
        component : RegistrationComponent
    },
    {
        path      : 'password-recovery/:data',
        component : ChangePasswordComponent
    },
    {
        path      : 'active-account/:id',
        component : UserActivationComponent
    },
    {
        path      : '',
        component : DashboardComponent,
        resolve   : {
            downloads      : ActiveDownloadingResolve,
            last_downloads : LastDownloadsResolve
        }
    },
    {
        path      : 'dashboard',
        component : DashboardComponent,
        resolve   : {
            downloads      : ActiveDownloadingResolve,
            last_downloads : LastDownloadsResolve
        }
    },
    {
        path      : 'files',
        component : FilesComponent
    },
    {
        path      : 'video/:id',
        component : VideoPageComponent,
        resolve   : {
            file : VideoPageResolve
        }
    },
    {
        path                  : 'uploads',
        component             : UploadsComponent,
        runGuardsAndResolvers : 'always',
        resolve               : {
            uploads : UploadsResolve
        }
    },
    {
        path      : 'settings',
        component : SettingsComponent
    },
    {
        path      : 'external-storage/:storage',
        component : ExternalStoragesComponent
    },
    {
        path      : 'choose-plan',
        component : UserPlanComponent
    },
    {
        path      : 'privacy-policy',
        component : PrivacyPolicyComponent
    },
    {
        path      : 'terms-of-use',
        component : TermsComponent
    },
    {
        path      : 'help',
        component : HelpComponent
    },
    {
        path      : 'contact',
        component : ContactComponent
    },
    {
        path: 'error-404',
        component: NotFoundComponent
    },
    {
        path: '**',
        redirectTo: 'error-404'
    }
];

@NgModule({
    imports : [RouterModule.forRoot(APP_ROUTES, {
        onSameUrlNavigation: 'reload'
    })],
    exports : [RouterModule]
})

export class AppRoutingModule {}
