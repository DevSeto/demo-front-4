import { Component } from '@angular/core';
import { UsersService } from '../../../services/component/users.service';
import { SocketService } from '../../../services/websocket/socket.service';
import { Router } from '@angular/router';

@Component({
    template: `<div></div>`,
    providers: [
        UsersService,
        SocketService
    ]
})

export class LogoutComponent {

    constructor(
        public usersService : UsersService,
        public socket       : SocketService,
        public router       : Router
    ) {
        this.processRedirection();
    }

    /**
     * User logout
     */
    public processRedirection() {
        this.socket.closeConnection();
        this.usersService.logoutUser();
        return this.router.navigate(['/login']);
    }

}
