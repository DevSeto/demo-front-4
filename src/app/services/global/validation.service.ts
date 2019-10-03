import { Injectable } from '@angular/core';
import { GlobalVariables } from '../../global.variables';

@Injectable()
export class ValidationService {

    constructor() {
    }

    public static password: string;

    /**
     * Get validation error message
     *
     * @param validatorName
     * @param validatorValue
     * @param fieldName
     */
    public static getValidatorErrorMessage(validatorName: string, validatorValue?: any, fieldName?: string): string {
        const config: any = {
            required                    : `The ${fieldName} field is required.`,
            invalidEmailAddress         : 'Invalid email address.',
            invalidPassword             : 'Invalid password. Password must be at least 6 characters long, and contain a number.',
            invalidPasswordConfirmation : 'These passwords don\'t match. Try again?',
            minlength                   : `Minimum length ${validatorValue.requiredLength}.`
        };

        return config[validatorName];
    }

    /**
     * Email Validator
     *
     * @param control
     * @param type
     */
    public static emailValidator(control: any, type: any): any {
        if (control.value && control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return {invalidEmailAddress: !!1};
        }
    }

    /**
     * Password validator
     *
     * @param control
     */
    public static currentPasswordValidator(control: any): any {

        if (control.value == GlobalVariables.USER.password) {
            return null;

        } else {
            return {invalidPassword: !!1};
        }
    }


    /**
     * Password validator
     *
     * @param control
     */
    public static passwordValidator(control: any): any {
        ValidationService.password = control.value;

        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return {invalidPassword: !!1};
        }
    }


    /**
     * Check if two password field are same
     *
     * @param control
     */
    public static passwordConfirmation(control: any): any {
        if (control.value == ValidationService.password) {
            return null;
        } else {
            return {invalidPasswordConfirmation: !!1};
        }
    }
}
