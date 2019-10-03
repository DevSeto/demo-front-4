import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { FilesService } from '../../../services/component/files.service';
import { UsersService } from '../../../services/component/users.service';
import { GlobalServices } from '../../../services/global/global.services';
import { GlobalVariables } from '../../../global.variables';

@Component({
    selector: 'upload-file',
    templateUrl: '../html/upload-file.component.html',
    styleUrls: ['../css/upload-file.component.css']
})

export class UploadFileComponent {
    @ViewChild('nzbUrl') nzbUrl: ElementRef;

    public dragAndDropUpload: boolean = false;
    public upload: boolean            = false;
    public userId: string;

    constructor(
        private usersService  : UsersService,
        private router        : Router,
        private notifications : NotificationsService,
        private filesService  : FilesService
    ) {
        if (GlobalServices.isLogged()) {
            this.userId = GlobalVariables.LOGGED_USER_ID;
        }
    }

    /**
     * Upload NZB file
     *
     * @param fileInput
     */
    public uploadNzbFile(fileInput: any) {
        if (fileInput.target.files) {
            const files: any       = fileInput.target.files;
            const formData: any    = new FormData();
            let countFiles: number = 0;

            formData.append('user_id', this.userId);

            for (const file of files) {
                if ((file.type && file.type == 'application/x-nzb') || file.name.split('.').pop() == 'nzb') {
                    formData.append('files[]', file);
                    countFiles++;
                }
            }

            if (!countFiles) {
                return this.notifications.error(
                    '',
                    'Please select the file with ".nzb" format',
                    {
                        animate: 'fromRight',
                        clickToClose: true,
                        pauseOnHover: true,
                        showProgressBar: true,
                        timeOut: 3000
                    }
                );
            }

            this.upload = true;

            this.filesService.createFile(formData).then((data: any) => {
                if (data.status) {
                    if (this.router.url == '/uploads') {
                        this.router.navigate(['/uploads'], { queryParams: { refresh: 'true' } });
                    } else {
                        this.router.navigate(['/uploads']);
                    }

                    this.upload = false;
                }
            });
        }
    }


    /**
     * Check if user insert url on upload nzb section
     *
     * @param event
     */
    public checkUrl(event: any) {
        if(this.nzbUrl.nativeElement.value) {
            event.preventDefault();

            this.upload         = true;
            const url: string   = this.nzbUrl.nativeElement.value;
            const formData: any = {
                url     : url,
                user_id : this.userId
            };

            this.filesService.createFileFromUrl(formData).then((data: any) => {
                this.nzbUrl.nativeElement.value = '';
                this.upload                     = false;

                if (data.status) {
                    if (this.router.url == '/uploads') {
                        this.router.navigate(['/uploads'], { queryParams: { refresh: 'true' } });
                    } else {
                        this.router.navigate(['/uploads']);
                    }
                } else {
                    this.notifications.error(
                        '',
                        'Please select the file with ".nzb" format',
                        {
                            animate: 'fromRight',
                            clickToClose: true,
                            pauseOnHover: true,
                            showProgressBar: true,
                            timeOut: 3000
                        }
                    );
                }
            });
        }
    }
}
