import { Component, OnInit, ViewEncapsulation, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TitleService } from '../../services/global/title.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../html/dashboard/dashboard.component.html',
    styleUrls: ['../../css/dashboard.component.css']
})

export class DashboardComponent implements OnInit {

    constructor(
        private renderer     : Renderer2,
        private router       : Router,
        private titleService : TitleService
    ) {}

    ngOnInit() {
        this.renderer.removeClass(document.body, 'white-background');
        this.titleService.setPageTitle('dashboard.page_title');
    }
}
