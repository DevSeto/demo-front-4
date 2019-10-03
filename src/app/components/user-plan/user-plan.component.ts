import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/component/users.service';
import { GlobalServices } from '../../services/global/global.services';
import { TitleService } from '../../services/global/title.service';
import { GlobalVariables } from '../../global.variables';

@Component({
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../html/user-plan/user-plan.component.html',
    styleUrls: ['../../css/user-plan.component.css']
})

export class UserPlanComponent implements OnInit {

    public userId: string;
    public selectedPlan: string;
    constructor(
        public router        : Router,
        public usersService  : UsersService,
        private titleService : TitleService
    ) {}

    ngOnInit() {
        this.titleService.setPageTitle('choose-plan.page_title');
        this.userId = GlobalVariables.LOGGED_USER_ID;
        this.selectedPlan = GlobalVariables.USER.plan;
    }


    /**
     * Update user personal settings
     */
    public updateUserPlan(plan: string) {
        // this.usersService.updateUserPersonalSettings(this.userId, {plan: plan}).then((data: any) => {
        //     if (data.status) {
        //         this.selectedPlan = plan;
        //     }
        // });
    }
}
