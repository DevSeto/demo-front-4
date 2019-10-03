import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../../services/component/users.service';
import { ValidationService } from '../../../services/global/validation.service';
import { GlobalServices } from '../../../services/global/global.services';
import { TitleService } from '../../../services/global/title.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
    templateUrl: '../../../html/registration/registration.component.html',
    styleUrls: ['../../../css/registration.component.css']
})

export class RegistrationComponent implements OnInit {

    public userEmail: string;
    public registrationError: any;
    public userRegistered: boolean             = false;
    public inputType: string                   = 'password';
    public inputConfirmation: string           = 'password';
    public toggleClassPassword: boolean        = false;
    public toggleClassPwdConfirmation: boolean = false;
    public isCapsLockActive: boolean           = false;
    public pwdConfirmationCapsLock: boolean    = false;
    public passwordCapsLock: boolean           = false;
    private userValidation: any                = {
        email: [
            '',
            [
                Validators.required,
                ValidationService.emailValidator,
                Validators.minLength(6)
            ]
        ],
        password: [
            '',
            [
                Validators.required,
                Validators.minLength(6)
            ]
        ],
        password_confirmation: [
            '',
            [
                Validators.required,
                Validators.minLength(6)
            ]
        ]
    };
    public user: any                           = {
        email: ''
    };
    public userForm: any;
    public userFormErrors: any;

    constructor(
        private renderer      : Renderer2,
        private router        : Router,
        private usersService  : UsersService,
        private formBuilder   : FormBuilder,
        private translate     : TranslateService,
        private notifications : NotificationsService,
        private titleService  : TitleService
    ) {}

    public ngOnInit() {
        if (GlobalServices.isLogged()) {
            this.router.navigate(['/']);
        }

        this.titleService.setPageTitle('registration.page_title');
        this.renderer.addClass(document.body, 'white-background');

        this.userForm   = this.formBuilder.group(this.userValidation,  {
            validator: this.passwordMatchValidator
        });

        this.setUserFormErrors();
    }

    /**
     * Form submit
     */
    @Input()
    public registration(): any {
        if (this.userFormValidation()) {
            this.usersService.registerUser(this.userForm.value).then((data: any) => {
                if (!data.status) {
                    this.registrationError = data.errorMessage;
                    window.setTimeout(() => {
                        this.registrationError = false;
                    }, 3000);
                } else {
                    // this.userEmail      = this.userForm.value.email;
                    // this.user.email     = this.userForm.value.email;
                    // this.userRegistered = true;
                    this.router.navigate(['/']);
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
        if (!this.userForm.controls[param].valid && this.userForm.controls[param].touched) {
            return !!1;
        } else if (this.userFormErrors[param].verify) {
            return !!1;
        } else {
            return !!0;
        }
    }

    /**
     * Check validation
     *
     * @returns {boolean}
     */
    private userFormValidation(): boolean {
        let verify = false;
        this.validateAllFormFields(this.userForm);

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
            email: {
                verify : false,
                text   : ''
            },
            password: {
                verify : false,
                text   : ''
            },
            password_confirmation: {
                verify : false,
                text   : ''
            }
        };
    }

    /**
     * Check all input validation
     *
     * @param formGroup
     */
    public validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    /**
     * Change input type
     *
     * @param type
     */
    public changeInputType(type: string) {
        if (type == 'inputType') {
            if (this.inputType == 'password') {
                this.inputType = 'text';
            } else {
                this.inputType = 'password';
            }
            this.toggleClassPassword = !this.toggleClassPassword;
        } else {
            if (this.inputConfirmation == 'password') {
                this.inputConfirmation = 'text';
            } else {
                this.inputConfirmation = 'password';
            }
            this.toggleClassPwdConfirmation = !this.toggleClassPwdConfirmation;
        }
    }

    /**
     * Check if caps lock active
     *
     * @param event
     * @param input
     */
    public isCapsLock(event: any, input: string) {
        if (event.key && lettersOnly(event)) {
            const keyword: string = event.key;
            if ( keyword.toUpperCase() === keyword && keyword.toLowerCase() !== keyword && !event.shiftKey ) {
                this.isCapsLockActive = true;
            } else {
                this.isCapsLockActive = false;
            }
        }

        if (input == 'password') {
            this.passwordCapsLock = this.isCapsLockActive;
        } else {
            this.pwdConfirmationCapsLock = this.isCapsLockActive;
        }

        function lettersOnly(event: any) {
            const key: number = event.keyCode;
            return (key >= 65 && key <= 90 && !event.shiftKey || key == 20);
        }
    }

    /**
     * Hide Caps Lock icon on blur
     */
    public hideCapsLock() {
        this.passwordCapsLock = false;
        this.pwdConfirmationCapsLock = false;
    }

    /**
     * Check if equal password and password confirmation
     *
     * @param formGroup
     * @returns {{mismatch: boolean}}
     */
    public passwordMatchValidator(formGroup: FormGroup) {
        return formGroup.get('password').value === formGroup.get('password_confirmation').value ? null : { mismatch: true };
    }
}
