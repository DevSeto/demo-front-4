import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { UploadFileComponent } from './component/upload-file.component';
import { DragAndDropDirective } from '../../directives/drag-and-drop-upload/drag-and-drop-upload.directive';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        MDBBootstrapModule
    ],
    declarations: [
        UploadFileComponent,
        DragAndDropDirective
    ],
    exports: [
        UploadFileComponent,
        MDBBootstrapModule,
        TranslateModule
    ]
})

export class UploadFileModule {}
