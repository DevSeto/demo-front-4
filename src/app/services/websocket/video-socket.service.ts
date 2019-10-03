import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConfig } from '../../configs/global.config';

const io: any = (<any>window).io;

@Injectable()
export class VideoSocketService {
    public socket: any = false;

    /**
     * Connect to socket server
     */
    public initSocket(): void {
        this.socket = (<any>window).io(GlobalConfig.video_socket_host);
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
     * Close connection
     */
    public closeConnection() {
        this.socket.close();
    }

}
