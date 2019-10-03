/****************************************    Module Section   ****************************************/
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material';
import 'hammerjs';
import { SimpleNotificationsModule } from 'angular2-notifications';
/****************************************   End Module Section   ****************************************/

/****************************************    Component Section   ****************************************/
import { AppComponent } from './components/app/app.component';
import { LayoutHeaderComponent } from './components/layouts/header.component';
import { LayoutFooterComponent } from './components/layouts/footer.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './components/auth/change-password/change-password.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { UserActivationComponent } from './components/auth/user-activation/user-activation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ActiveDownloadingComponent } from './components/dashboard/active-downloading/active-downloading.component';
import { ActiveDownloadingResolve } from './components/dashboard/active-downloading/active-downloading.resolve';
import { LastDownloadsComponent } from './components/dashboard/last-downloads/last-downloads.component';
import { LastDownloadsResolve } from './components/dashboard/last-downloads/last-downloads.resolve';
import { UserPlanComponent } from './components/user-plan/user-plan.component';
import { FilesComponent } from './components/files/files.component';
import { DefaultTabComponent } from './components/files/s3/default-tab.component';
import { GoogleTabComponent } from './components/files/google-drive/google-tab.component';
import { OneDriveTabComponent } from './components/files/onedrive/onedrive-tab.component';
import { DropboxTabComponent } from './components/files/dropbox/dropbox-tab.component';
import { VideoPageComponent } from './components/files/video-page/video-page.component';
import { VideoPageResolve } from './components/files/video-page/video-page.resolve';
import { UploadsComponent } from './components/uploads/uploads.component';
import { UploadsResolve } from './components/uploads/uploads.resolve';
import { SettingsComponent } from './components/settings/settings.component';
import { ConnectionsTabComponent } from './components/settings/connections/connections-tab.component';
import { UsenetTabComponent } from './components/settings/usenet-server/usenet-tab.component';
import { ExternalStoragesComponent } from './components/external-storages/external-storages.component';
import { NotFoundComponent } from './components/error-404/error-404.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsComponent } from './components/terms/terms.component';
import { HelpComponent } from './components/help/help.component';
import { ContactComponent } from './components/contact/contact.component';
/****************************************    End Component Section   ****************************************/

/****************************************    Service Section   ****************************************/
import { UsersService } from './services/component/users.service';
import { FilesService } from './services/component/files.service';
import { FoldersService } from './services/component/folders.service';
import { VideosService } from './services/component/videos.service';
import { NotificationService } from './services/component/notification.service';
import { StorageService } from './services/global/storage.service';
import { TitleService } from './services/global/title.service';
import { SocketService } from './services/websocket/socket.service';
import { VideoSocketService } from './services/websocket/video-socket.service';
import { ContactService } from './services/component/contact.service';
import { UsenetService } from './services/component/usenet.service';
import { ChangesService } from './services/global/changes.service';
/****************************************    End Service Section   ****************************************/

/****************************************    Custom Module Section   ****************************************/
import { UploadFileModule } from './modules/upload-files/upload-file.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { NavigationService } from './modules/navigation/service/navigation.service';
import { NotificationModule } from './modules/notification/notification.module';
/****************************************    End Custom Module Section   ****************************************/

/****************************************    Models Section   ****************************************/
import { Model } from './models/model';
import { UserModel } from './models/user.model';
import { FoldersModel } from './models/folders.model';
import { FilesModel } from './models/files.model';
import { StorageModel } from './models/storage.model';
/****************************************    End Models Section   ****************************************/

/****************************************    Pipe Section   ****************************************/
import { FileSizePipe } from './pipes/storage/file-size';
/****************************************    End Pipe Section   ****************************************/

import { AppRoutingModule } from './app.routing.module';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        LayoutHeaderComponent,
        LayoutFooterComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ChangePasswordComponent,
        UserActivationComponent,
        LogoutComponent,
        RegistrationComponent,
        NotFoundComponent,
        PrivacyPolicyComponent,
        TermsComponent,
        HelpComponent,
        ContactComponent,
        DashboardComponent,
        ActiveDownloadingComponent,
        LastDownloadsComponent,
        UserPlanComponent,
        FilesComponent,
        DefaultTabComponent,
        GoogleTabComponent,
        OneDriveTabComponent,
        DropboxTabComponent,
        VideoPageComponent,
        UploadsComponent,
        SettingsComponent,
        ConnectionsTabComponent,
        UsenetTabComponent,
        ExternalStoragesComponent,
        FileSizePipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        SimpleNotificationsModule.forRoot(),
        MDBBootstrapModule.forRoot(),
        NgbModule.forRoot(),
        MatPaginatorModule,
        UploadFileModule,
        NotificationModule,
        NavigationModule
    ],
    providers: [
        Title,
        UsersService,
        NotificationService,
        FilesService,
        FoldersService,
        VideosService,
        StorageService,
        TitleService,
        SocketService,
        VideoSocketService,
        ContactService,
        UsenetService,
        ChangesService,
        ActiveDownloadingResolve,
        LastDownloadsResolve,
        UploadsResolve,
        VideoPageResolve,
        NavigationService,
        Model,
        UserModel,
        FoldersModel,
        FilesModel,
        StorageModel
    ],
    bootstrap: [ AppComponent ],
    schemas: [ NO_ERRORS_SCHEMA ]
})

export class AppModule {
}
