import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FilesService } from '../../services/component/files.service';
import { NotificationsService } from 'angular2-notifications';
import { GlobalServices } from '../../services/global/global.services';
import { GlobalVariables } from '../../global.variables';

@Directive({
    selector: '[drag-and-drop]'
})

export class DragAndDropDirective {
    public userId: string;

    @Input() dragAndDropUpload;
    @Output() dragAndDropUploadChange: EventEmitter<any> = new EventEmitter();

    constructor(
        private router        : Router,
        private filesService  : FilesService,
        private notifications : NotificationsService
    ) {
        if (GlobalServices.isLogged()) {
            this.userId = GlobalVariables.LOGGED_USER_ID;
        }
    }

    @HostListener('dragover', ['$event'])
    public onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dragAndDropUploadChange.emit(false);
    }

    @HostListener('drop', ['$event'])
    public onDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dragAndDropUploadChange.emit(false);

        const files: any       = event.dataTransfer.files;
        let countFiles: number = 0;
        if (files.length > 0) {
            const formData: any = new FormData();
            for (const file of files) {
                if (file.type == 'application/x-nzb') {
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

            formData.append('user_id', this.userId);

            this.filesService.createFile(formData) .then((data: any) => {
                if (data.status) {
                    if (this.router.url == '/uploads') {
                        this.router.navigate(['/uploads'], { queryParams: { refresh: 'true' } });
                    } else {
                        this.router.navigate(['/uploads']);
                    }
                }
            });
        }
    }
}
