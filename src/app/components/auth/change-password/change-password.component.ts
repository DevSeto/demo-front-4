import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsersService } from '../../../services/component/users.service';
import { GlobalServices } from '../../../services/global/global.services';
import { TitleService } from '../../../services/global/title.service';

@Component({
    templateUrl: '../../../html/change-password/change-password.component.html',
    styleUrls: ['../../../css/change-password.component.css']
})

export class ChangePasswordComponent implements OnInit {
    public userData: any;
    public passwordForm: any;
    public passwordFormErrors: any;
    public userRegistered: boolean                  = false;
    public inputType: string                        = 'password';
    public inputTypeConfirmation: string            = 'password';
    public toggleClassPassword: boolean             = false;
    public toggleClassPasswordConfirmation: boolean = false;
    public isCapsLockActive: boolean                = false;
    public passwordConfirmationCapsLock: boolean    = false;
    public passwordCapsLock: boolean                = false;
    private formValidation: any                     = {
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


    constructor(
        private renderer     : Renderer2,
        private route        : ActivatedRoute,
        private router       : Router,
        private usersService : UsersService,
        private formBuilder  : FormBuilder,
        private titleService : TitleService
    ) {
        this.getUserData();
    }

    ngOnInit() {
        if (GlobalServices.isLogged() || !this.checkData()) {
            this.router.navigate(['/']);
        }

        this.renderer.addClass(document.body, 'white-background');
        this.titleService.setPageTitle('forgot-password.page_title');

        this.passwordForm = this.formBuilder.group(this.formValidation,  {
            validator: this.passwordMatchValidator
        });

        this.setFormErrors();
    }

    /**
     * Get user data
     */
    public getUserData() {
        this.userData = JSON.parse(Buffer.from(this.route.snapshot.params.data, 'base64').toString());
    }

    /**
     * Check if url expired
     */
    public checkData() {
        const dateExpired: number     = this.userData.date;
        const date: number            = Date.now();
        const checkDifference: number = Math.floor((date - dateExpired) / 60000);

        if (checkDifference > 5) {
            return false;
        }
        return true;
    }

    /**
     * Submit form
     */
    @Input()
    public changePassword(): void {
        if (this.passwordForm.dirty && this.passwordForm.valid) {
            const user: any = {
                user_id  : this.userData.user_id,
                password : this.passwordForm.value.password
            };

            this.usersService.changeUserPassword(user).then((data: any) => {
                if (data.status) {
                    this.router.navigate(['/login']);
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
        if ((!this.passwordForm.controls[param].valid && this.passwordForm.controls[param].touched) || this.passwordFormErrors[param].verify) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Set form input errors
     */
    private setFormErrors(): void {
        this.passwordFormErrors = {
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
            if (this.inputTypeConfirmation == 'password') {
                this.inputTypeConfirmation = 'text';
            } else {
                this.inputTypeConfirmation = 'password';
            }
            this.toggleClassPasswordConfirmation = !this.toggleClassPasswordConfirmation;
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
            if (this.isCapsLockActive) {
                this.passwordCapsLock = true;
            } else {
                this.passwordCapsLock = false;
            }
        } else {
            if (this.isCapsLockActive) {
                this.passwordConfirmationCapsLock = true;
            } else {
                this.passwordConfirmationCapsLock = false;
            }
        }

        function lettersOnly(event: any) {
            const key: number = event.keyCode;
            return ((key >= 65 && key <= 90 && !event.shiftKey || key == 20));
        }
    }

    /**
     * Hide Caps Lock icon on blur
     */
    public hideCapsLock() {
        this.passwordCapsLock             = false;
        this.passwordConfirmationCapsLock = false;
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
