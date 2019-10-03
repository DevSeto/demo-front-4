import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { UsersService } from '../../services/component/users.service';
import { GlobalServices } from '../../services/global/global.services';
import { ValidationService } from '../../services/global/validation.service';
import { TitleService } from '../../services/global/title.service';
import { GlobalVariables } from '../../global.variables';

@Component({
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../html/settings/settings.component.html',
    styleUrls: ['../../css/settings.component.css']
})

export class SettingsComponent implements OnInit {

    public userEmail: string;
    public userForm: any;
    public userFormErrors: any;
    public userId: string;
    private windowHandle: any   = null;
    public activeTab: string    = 'personal';
    public tabs: any            = {
        personal: true,
        notifications: false,
        payment: false,
        connection: false,
        usenet: false,
        storage: false
    };
    private userValidation: any = {
        current_password: [
            '',
            [
                Validators.required,
                ValidationService.currentPasswordValidator,
                Validators.minLength(6)
            ]
        ],
        new_password: [
            '',
            [
                Validators.required,
                Validators.minLength(6)
            ]
        ],
        confirm_password: [
            '',
            [
                Validators.required,
                Validators.minLength(6)
            ]
        ]
    };

    constructor(
        private route         : ActivatedRoute,
        private router        : Router,
        private usersService  : UsersService,
        private formBuilder   : FormBuilder,
        private notifications : NotificationsService,
        private titleService  : TitleService
    ) {
        this.route.fragment.subscribe((fragment: string) => {
            if (fragment !== null && typeof fragment !== 'undefined') {
                this.activeTab = fragment;
                this.toggleTabClass(this.activeTab);
            }
        });
    }

    ngOnInit() {
        this.titleService.setPageTitle('settings.page_title');

        this.userId    = GlobalVariables.LOGGED_USER_ID;
        this.userEmail = GlobalVariables.USER.email;
        this.userForm  = this.formBuilder.group(this.userValidation,  {
            validator: this.passwordMatchValidator
        });

        this.setUserFormErrors();
    }

    /**
     * Form submit
     */
    @Input()
    public savePassword(): void {
        if (this.userFormValidation()) {
            const userPersonal: any = {
                password: this.userForm.value.new_password
            };

            this.usersService.updateUserPersonalSettings(GlobalVariables.LOGGED_USER_ID, userPersonal).then((data: any) => {
                if (data.status) {
                    this.notifications.success(
                        '',
                        'Your Password successfully updated',
                        {
                            animate: 'fromRight',
                            clickToClose: true,
                            pauseOnHover: true,
                            showProgressBar: true,
                            timeOut: 3000
                        }
                    );
                }

                this.userForm.reset();
            });
        }
    }

    /**
     * Check validation
     *
     * @returns {boolean}
     */
    private userFormValidation(): boolean {
        let verify: boolean = false;

        if (this.userForm.dirty && this.userForm.valid) {
            verify = true;
        }
        return verify;
    }

    /**
     * Set form input errors
     */
    private setUserFormErrors(): void {
        this.userFormErrors = {
            current_password: {
                verify  : false,
                message : ''
            },
            new_password: {
                verify  : false,
                message : ''
            },
            confirm_password: {
                verify  : false,
                message : ''
            }
        };
    }

    /**
     * Change active nav item
     *
     * @param activeItem
     */
    public toggleClass(activeItem: string) {
        this.activeTab = activeItem;
        this.toggleTabClass(this.activeTab);
    }

    /**
     * Change tab
     *
     * @param activeItem
     */
    public toggleTabClass(activeItem: string) {
        Object.keys(this.tabs).forEach(v => this.tabs[v] = false);
        this.tabs[activeItem] = true;
    }

    /**
     * Input error class
     *
     * @param param
     * @returns {boolean}
     */
    public classError(param: string) {
        if ((!this.userForm.controls[param].valid && this.userForm.controls[param].touched) || this.userFormErrors[param].verify) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Check if equal password and password confirmation
     *
     * @param formGroup
     * @returns {{mismatch: boolean}}
     */
    public passwordMatchValidator(formGroup: FormGroup) {
        return formGroup.get('new_password').value === formGroup.get('confirm_password').value ? null : { mismatch: true };
    }
}
