import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: '../../html/layout/footer.component.html',
    styleUrls: ['../../css/footer.component.css']
})

export class LayoutFooterComponent {

    public date: any = {
        year: false
    };

    constructor() {
        this.date.year = (new Date()).getFullYear();
    }
}
