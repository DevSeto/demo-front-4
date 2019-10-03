import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';


@Injectable()
export class TitleService {

    constructor(
        private translate    : TranslateService,
        private titleService : Title
    ) {}

    /**
     * Get cloud authorization url
     *
     * @param cloud
     */
    public setPageTitle(title: string) {
        const self: any = this;

        self.translate.get(title).subscribe(
            value => {
                self.titleService.setTitle('NZB Cloud | ' + value);
            }
        );

        self.translate.onLangChange.subscribe((event: any) => {
            self.translate.get(title).subscribe(
                value => {
                    self.titleService.setTitle('NZB Cloud | ' + value);
                }
            );
        });
    }
}
