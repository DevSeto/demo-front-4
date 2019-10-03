import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
import { NavigationService } from '../service/navigation.service';
import { GlobalServices } from '../../../services/global/global.services';

@Component({
    selector: '<files-navigation></files-navigation>',
    templateUrl: '../html/navigation.component.html'
})

export class NavigationComponent implements OnInit {
    public cloud: string;
    public navigation: any = [];

    constructor(
        private route       : ActivatedRoute,
        private router      : Router,
        private navService  : NavigationService
    ) {
        this.route.queryParams.subscribe(params => {
            if (GlobalServices.isLogged()) {
                if (params.cloud) {
                    this.cloud = params.cloud;
                } else {
                    this.cloud = '';
                }
            }
        });
    }

    ngOnInit() {
        const self: any = this;

        this.navService.navUpdated.subscribe(function() {
            self.navigation = self.navService.getNavigation();
        });

    }
}
