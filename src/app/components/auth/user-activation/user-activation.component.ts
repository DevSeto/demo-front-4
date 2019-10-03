import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../services/component/users.service';
import { GlobalServices } from '../../../services/global/global.services';
import { TitleService } from '../../../services/global/title.service';

@Component({
    template: `<div></div>`
})

export class UserActivationComponent implements OnInit {

    public userId: string;

    constructor(
        private route        : ActivatedRoute,
        private router       : Router,
        private usersService : UsersService,
        private titleService : TitleService
    ) {}

    public ngOnInit() {
        if (GlobalServices.isLogged()) {
            this.router.navigate(['/']);
        }

        this.titleService.setPageTitle('global.activation');
        this.getUserId();
        this.changeUserActiveStatus();
    }

    public getUserId() {
        this.userId = this.route.snapshot.params.id;
    }

    public changeUserActiveStatus() {
        const self: any = this;
        this.usersService.getUser(this.userId).then(() => {
            self.usersService.changeUserActiveStatus(this.userId).then((data: any) => {
                window.location.href = '/choose-plan';
            });
        });
    }
}
