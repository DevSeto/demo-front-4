import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationComponent } from './component/notification.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule
    ],
    declarations: [
        NotificationComponent
    ],
    exports: [
        NotificationComponent,
        TranslateModule
    ]
})

export class NotificationModule {}
