import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable()

export class NavigationService {
    @Output()
    public navUpdated: any = new EventEmitter();
    public navigation: any = [];

    /**
     * Get navigation
     */
    public getNavigation() {
        const navigation: any = this.navigation;
        return navigation.reverse();
    }

    /**
     * Add item in navigation
     * @param data
     */
    public pushNav(data: any) {
        this.navigation.push(data);
    }

    /**
     * Empty Navigation
     */
    public empty() {
        this.navigation = [];
        this.navUpdated.emit(true);
    }

    /**
     * Set done for getting completed navigation
     */
    public done() {
        this.navUpdated.emit(true);
    }
}
