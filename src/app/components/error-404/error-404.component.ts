import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../services/global/title.service';

@Component({
    templateUrl: '../../html/error-404/error-404.component.html',
    styleUrls: ['../../css/error-404.component.css']
})

export class NotFoundComponent implements OnInit {

    constructor(
        private titleService: TitleService
    ) {}

    ngOnInit() {
        this.titleService.setPageTitle('404-error.page_title');
    }
}
