import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../services/global/title.service';

@Component({
    templateUrl: '../../html/terms/terms.component.html',
    styleUrls: ['../../css/help.component.css']
})

export class TermsComponent implements OnInit {

    constructor(
        private titleService: TitleService
    ) {}

    ngOnInit() {
        this.titleService.setPageTitle('terms.page_title');
    }
}
