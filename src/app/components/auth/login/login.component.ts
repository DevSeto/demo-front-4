import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { UsersService } from '../../../services/component/users.service';
import { GlobalServices } from '../../../services/global/global.services';
import { _ } from '../../../services/helpers/helper.service';
import { TitleService } from '../../../services/global/title.service';

@Component({
    templateUrl: '../../../html/login/login.component.html',
    styleUrls: ['../../../css/login.component.css']
})

export class LoginComponent implements OnInit {
    public userForm: any;
    public loginError: boolean;
    public isCapsLockActive : boolean = false;
    public toggleClass : boolean      = false;
    public inputType: string          = 'password';
    public errors: any                = {
        verify: false,
        message: _._
    };
    public _userFormErrors: any       = {
        email: {
            verify: !!0,
            message: _._
        },
        password: {
            verify: !!0,
            message: _._
        },
        remember: {
            verify: !!0,
            message: _._
        }
    };

    constructor(
        private renderer     : Renderer2,
        private router       : Router,
        private usersService : UsersService,
        private formBuilder  : FormBuilder,
        private titleService : TitleService
    ) {
        this.setUserFormValidation();
    }

    ngOnInit() {
        if (GlobalServices.isLogged()) {
            this.router.navigate(['/']);
        }

        this.renderer.addClass(document.body, 'white-background');
        this.titleService.setPageTitle('login.page_title');
    }

    /**
     * Set user validation
     */
    private setUserFormValidation(): void {
        this.userForm = this.formBuilder.group({
            'email'    : ['', Validators.required],
            'password' : ['', Validators.required],
            'remember' : [, Validators.nullValidator]
        });
    }

    /**
     * Submit Login form
     */
    @Input()
    public login(): void {
        let user: any;

        if (this.userForm.dirty && this.userForm.valid) {
            user = {
                email    : this.userForm.value.email,
                password : this.userForm.value.password,
                remember : this.userForm.value.remember
            };

            this.usersService.loginUser(user).then((data: any) => {
                if (!data.status) {
                    this.loginError     = data.errorMessage;
                    this.errors.verify  = true;
                    this.errors.message = data.errorMessage;
                    this.userFormErrors = data.errorMessage;

                    window.setTimeout(() => {
                        this.loginError = false;
                    }, 3000);
                } else {
                    this.router.navigate(['/']);
                }
            });
        } else {
            this.validateAllFormFields(this.userForm);
        }
    }

    /**
     * Get login form errors
     *
     * @returns {any}
     */
    public get userFormErrors(): any {
        return this._userFormErrors;
    }

    /**
     * Set login form errors
     *
     * @param currentErrors
     */
    public set userFormErrors(currentErrors: any) {
        if (_.empty(currentErrors)) {
            for (const key in currentErrors) {
                if (currentErrors.hasOwnProperty(key) && this._userFormErrors.hasOwnProperty(key)) {
                    this._userFormErrors[key].verify = !!1;
                    this._userFormErrors[key].text   = currentErrors[key];
                }
            }
        }
    }

    /**
     * Add class error
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
     * Validate all fields
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
     */
    public changeInputType() {
        if (this.inputType == 'password') {
            this.inputType = 'text';
        } else {
            this.inputType = 'password';
        }

        this.toggleClass = !this.toggleClass;
    }

    /**
     * Check if capslock active
     *
     * @param event
     * @returns {boolean}
     */
    public isCapsLock(event: any) {
        event             = (event) ? event : window.event;
        let charCode: any = false;
        if (event.which) {
            charCode = event.which;
        } else if (event.keyCode) {
            charCode = event.keyCode;
        }

        let shiftOn = false;
        if (event.shiftKey) {
            shiftOn = event.shiftKey;
        } else if (event.modifiers) {
            shiftOn = !!(event.modifiers & 4);
        }

        if (charCode >= 97 && charCode <= 122 && shiftOn) {
            this.isCapsLockActive = true;
        } else if (charCode >= 65 && charCode <= 90 && !shiftOn) {
            this.isCapsLockActive = true;
        } else {
            this.isCapsLockActive = false;
        }
    }
}
