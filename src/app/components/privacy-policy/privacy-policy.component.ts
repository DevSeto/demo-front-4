import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../services/global/title.service';

@Component({
    templateUrl: '../../html/privacy-policy/privacy-policy.component.html',
    styleUrls: ['../../css/privacy-policy.component.css']
})

export class PrivacyPolicyComponent implements OnInit {

    constructor(
        private titleService: TitleService
    ) {}

    ngOnInit() {
        this.titleService.setPageTitle('privacy-policy.page_title');
    }
}
