import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from './component/navigation.component';
import { NavigationService } from './service/navigation.service';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule
    ],
    providers: [NavigationService],
    declarations: [
        NavigationComponent
    ],
    exports: [
        NavigationComponent,
        TranslateModule
    ]
})

export class NavigationModule {}
