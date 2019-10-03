import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketConfig } from '../../configs/socket.config';
import { GlobalVariables } from '../../global.variables';

const io: any = (<any>window).io;

@Injectable()
export class SocketService {
    public socket: any = false;

    /**
     * Connect to socket server
     */
    public initSocket(): void {
        if (!this.socket) {
            this.socket = (<any>window).io(SocketConfig.host + ':' + SocketConfig.port, {
                query: {
                    user_id: GlobalVariables.LOGGED_USER_ID
                },
                transports: ['websocket']
            });
        }
    }

    /**
     * Send data to socket server
     *
     * @param event
     * @param message
     */
    public send(event: string, message: any): void {
        if (!this.socket) {
            this.initSocket();
        }
        this.socket.emit(event, message);
    }

    /**
     * Get data from socket server
     *
     * @param event
     * @returns {Observable<any>|"rxjs/internal/Observable".Observable<any>}
     */
    public onMessage(event: string): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on(event, (data: any) => observer.next(data));
        });
    }

    /**
     * Close the connection
     */
    public closeConnection() {
        this.socket.disconnect()
    }
}
