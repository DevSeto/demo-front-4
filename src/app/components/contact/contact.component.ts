import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../services/global/validation.service';
import { ContactService } from '../../services/component/contact.service';
import { TitleService } from '../../services/global/title.service';

@Component({
    templateUrl: '../../html/contact/contact.component.html',
    styleUrls: ['../../css/contact.component.css']
})

export class ContactComponent implements OnInit {

    public contactForm: any;
    public nzbCloudEmail: object = {
        email: 'info@nzbcloud.com'
    };
    public phones: object        = [
        {
            phone: '121-393-9913'
        },
        {
            phone: '969-123-3522'
        }
    ];
    public address: string       = '<p class="no-margin">20 Williamson Garden Apt. 713</p>\n' +
                                   '<p class="no-margin">Amsterdam, Netherland</p>';
    constructor(
        private contactService : ContactService,
        private formBuilder    : FormBuilder,
        private notifications  : NotificationsService,
        private translate      : TranslateService,
        private titleService   : TitleService
    ) {}

    ngOnInit() {
        this.titleService.setPageTitle('contact.page_title');
        this.setUserFormValidation();
    }

    /**
     * Set form validation
     */
    private setUserFormValidation(): void {
        this.contactForm = this.formBuilder.group({
            'name'    : ['', Validators.required],
            'email'   : ['', [Validators.required, ValidationService.emailValidator]],
            'message' : ['', Validators.required]
        });
    }

    /**
     * Submit contact form
     */
    public contact() {
        if (this.contactForm.dirty && this.contactForm.valid) {
            const formData: object = this.contactForm.value;

            this.contactService.send(formData).then((data: any) => {
                if (data.status) {
                    this.notifications.success(
                        '',
                        this.translate.instant('contact.submit_success'),
                        {
                            animate: 'fromRight',
                            clickToClose: true,
                            pauseOnHover: true,
                            showProgressBar: true,
                            timeOut: 3000
                        }
                    );
                } else {
                    this.notifications.error(
                        '',
                        this.translate.instant('contact.submit_error'),
                        {
                            animate: 'fromRight',
                            clickToClose: true,
                            pauseOnHover: true,
                            showProgressBar: true,
                            timeOut: 3000
                        }
                    );
                }

                this.contactForm.reset();
            });
        } else {
            this.validateAllFormFields(this.contactForm);
        }
    }


    /**
     * Add class error
     *
     * @param param
     * @returns {boolean}
     */
    public classError(param: string) {
        if (!this.contactForm.controls[param].valid && this.contactForm.controls[param].touched) {
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

}
