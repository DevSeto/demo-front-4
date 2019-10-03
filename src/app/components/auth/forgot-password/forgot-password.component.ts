import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../../../services/component/users.service';
import { ValidationService } from '../../../services/global/validation.service';
import { GlobalServices } from '../../../services/global/global.services';
import { TitleService } from '../../../services/global/title.service';

@Component({
    templateUrl: '../../../html/forgot-password/forgot-password.component.html',
    styleUrls: ['../../../css/forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {
    public forgotForm: any;
    public forgotError: any;
    public forgotFormErrors: any;
    public resetPassword: boolean = false;
    private formValidation: any   = {
        email: [
            '',
            [
                Validators.required,
                ValidationService.emailValidator,
                Validators.minLength(6)
            ]
        ]
    };
    public user: any = {
        email: ''
    };


    constructor(
        private renderer     : Renderer2,
        private router       : Router,
        private usersService : UsersService,
        private formBuilder  : FormBuilder,
        private titleService : TitleService
    ) {}

    ngOnInit() {
        if (GlobalServices.isLogged()) {
            this.router.navigate(['/']);
        }

        this.renderer.addClass(document.body, 'white-background');
        this.titleService.setPageTitle('forgot-password.page_title');

        this.forgotForm = this.formBuilder.group(this.formValidation);
        this.setFormErrors();
    }

    /**
     * Set form input errors
     */
    private setFormErrors(): void {
        this.forgotFormErrors = {
            email: {
                verify : false,
                text   : ''
            }
        };
    }

    /**
     * Submit form
     */
    @Input()
    public recoveryPassword(): void {
        let user: any;

        if (this.forgotForm.dirty && this.forgotForm.valid) {
            user = {
                email: this.forgotForm.value.email
            };

            this.usersService.forgotPassword(user).then((data: any) => {
                if (!data.status) {
                    this.forgotError = data.errorMessage;

                    window.setTimeout(() => {
                        this.forgotError = false;
                    }, 3000);
                } else {
                    this.user.email    = this.forgotForm.value.email;
                    this.resetPassword = true;
                }
            });
        }
    }


    /**
     * Set input error
     *
     * @param param
     * @returns {boolean}
     */
    public classError(param: string) {
        if ((!this.forgotForm.controls[param].valid && this.forgotForm.controls[param].touched) || this.forgotFormErrors[param].verify) {
            return true;
        } else {
            return false;
        }
    }
}
