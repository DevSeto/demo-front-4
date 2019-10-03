import { Injectable } from '@angular/core';
import { Model } from './model';

@Injectable()
export class UserModel extends Model {

    /**
     * Get user
     *
     */
    public getUser() {
        const user: any = this.getProperty('user');

        return user;
    }

    /**
     * Update user data
     *
     * @param data
     */
    public updateUser(data: any) {
        this.setProperty('user', data);
    }
}
