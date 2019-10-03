import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { UsenetService } from '../../../services/component/usenet.service';
import { ValidationService } from '../../../services/global/validation.service';
import { GlobalVariables } from '../../../global.variables';

@Component({
    selector: 'usenet-tab',
    templateUrl: '../../../html/settings/usenet-tab.component.html'
})

export class UsenetTabComponent {

    @ViewChild('addUsenetModal')
    private addUsenetModal: ModalDirective;

    @ViewChild('editUsenetModal')
    private editUsenetModal: ModalDirective;

    @ViewChild('deleteModal')
    private deleteModal: ModalDirective;

    public servers: any = [];
    public server: any;
    public userId: string;
    public formErrors: any;
    public modalRef: any;
    public form: any;
    private validation: any  = {
        server_name: [
            '',
            [
                Validators.required
            ]
        ],
        server_host: [
            '',
            [
                Validators.required
            ]
        ],
        server_port: [
            '',
            [
                Validators.required
            ]
        ],
        server_username: [
            '',
            [
                Validators.required
            ]
        ],
        server_password: [
            '',
            [
                Validators.required
            ]
        ],
        server_connection_limit: [
            '',
            [
                Validators.required
            ]
        ]
    };

    constructor(
        private formBuilder   : FormBuilder,
        private route         : ActivatedRoute,
        private notifications : NotificationsService,
        private usenetService : UsenetService
    ) {
        this.userId = GlobalVariables.LOGGED_USER_ID;
        this.form   = this.formBuilder.group(this.validation);
        this.getUserUsenetServers();
        this.setFormErrors();
    }


    /**
     * Get usenet servers
     */
    public getUserUsenetServers() {
        const self: any = this;
        this.usenetService.get(this.userId).then(function(response: any) {
            self.servers = response.usenet_servers;
        });
    }


    /**
     * Add usenet server modal
     */
    public addUsenetServerModal() {
        this.form.reset();

        this.addUsenetModal.show();
    }


    /**
     * Delete usenet server modal
     *
     * @param data
     */
    public deleteUsenetServerModal(data: any) {
        this.form.reset();
        this.server = data;
        this.deleteModal.show();
    }

    /**
     * Edit usenet server modal
     *
     * @param data
     */
    public editUsenetServerModal(data: any) {
        this.server = data;
        this.form.patchValue({
            server_name: data.server_name,
            server_host: data.server_host,
            server_port: data.server_port,
            server_username: data.server_username,
            server_password: data.server_password,
            server_connection_limit: data.server_connection_limit
        });
        this.editUsenetModal.show();
    }

    /**
     * Test usenet server connection
     */
    public testConnection() {
        const paramas: any = [
            this.form.get('server_host').value,
            parseInt(this.form.get('server_port').value),
            this.form.get('server_username').value,
            this.form.get('server_password').value,
            false,
            '',
            parseInt(this.form.get('server_connection_limit').value),
        ];
        const data: any   = {
            'method'  : 'testserver',
            'nocache' : new Date().getTime(),
            'params'  : paramas
        };

        this.usenetService.testUsenetServer(data).then((response: any) => {
            if (response.result == '') {
                this.notifications.success(
                    '',
                    'Successfuly connected to the ' + this.form.get('server_host').value,
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
                    'Invalid credentials',
                    {
                        animate: 'fromRight',
                        clickToClose: true,
                        pauseOnHover: true,
                        showProgressBar: true,
                        timeOut: 3000
                    }
                );
            }
        });
    }

    /**
     * Save usenet server
     */
    public save() {
        if (this.formValidation()) {
            this.addUsenetModal.hide();

            const useneteServerData: any = {
                user_id                 : this.userId,
                server_name             : this.form.value.server_name,
                server_host             : this.form.value.server_host,
                server_port             : this.form.value.server_port,
                server_username         : this.form.value.server_username,
                server_password         : this.form.value.server_password,
                server_connection_limit : this.form.value.server_connection_limit
            };

            this.usenetService.createUsenetServer(useneteServerData).then((response: any) => {
                if (response.status) {
                    this.getUserUsenetServers();

                    this.notifications.success(
                        '',
                        response.userMessage,
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
                        response.errorMessage,
                        {
                            animate: 'fromRight',
                            clickToClose: true,
                            pauseOnHover: true,
                            showProgressBar: true,
                            timeOut: 3000
                        }
                    );
                }
            });
        } else {
            this.validateAllFormFields(this.form);
        }
    }

    /**
     * Update usenet server
     */
    public update() {
        if (this.formValidation()) {
            const useneteServerData: any = {
                user_id                 : this.userId,
                server_name             : this.form.value.server_name,
                server_host             : this.form.value.server_host,
                server_port             : this.form.value.server_port,
                server_username         : this.form.value.server_username,
                server_password         : this.form.value.server_password,
                server_connection_limit : this.form.value.server_connection_limit
            };

            this.usenetService.updateUsenetServer(this.server._id, useneteServerData).then((response: any) => {
                if (response.status) {
                    this.getUserUsenetServers();
                    this.editUsenetModal.hide();

                    this.notifications.success(
                        '',
                        response.userMessage,
                        {
                            animate: 'fromRight',
                            clickToClose: true,
                            pauseOnHover: true,
                            showProgressBar: true,
                            timeOut: 3000
                        }
                    );
                }
            });
        } else {
            this.validateAllFormFields(this.form);
        }
    }

    /**
     * Deletes usenet server
     */
    public deleteUsenetServer() {
        const data: any = {
            id: this.server._id
        };

        this.deleteModal.hide();

        this.usenetService.deleteUsenetServer(data).then((response: any) => {
            if (response.status) {
                this.server = '';
                this.getUserUsenetServers();
                this.notifications.success(
                    '',
                    response.userMessage,
                    {
                        animate: 'fromRight',
                        clickToClose: true,
                        pauseOnHover: true,
                        showProgressBar: true,
                        timeOut: 3000
                    }
                );
            }
        });
    }

    /**
     * Set form input errors
     */
    private setFormErrors(): void {
        this.formErrors = {
            server_name: {
                verify  : false,
                message : ''
            },
            server_host: {
                verify  : false,
                message : ''
            },
            server_port: {
                verify  : false,
                message : ''
            },
            server_username: {
                verify  : false,
                message : ''
            },
            server_password: {
                verify  : false,
                message : ''
            },
            server_connection_limit: {
                verify  : false,
                message : ''
            }
        };
    }

    /**
     * Check validation
     *
     * @returns {boolean}
     */
    private formValidation(): boolean {
        let verify: boolean = false;

        if (this.form.valid) {
            verify = true;
        }
        return verify;
    }

    /**
     * Input error class
     *
     * @param param
     * @returns {boolean}
     */
    @Input()
    public classError(param: string)  {
        if ((!this.form.controls[param].valid && this.form.controls[param].touched) || this.formErrors[param].verify) {
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
