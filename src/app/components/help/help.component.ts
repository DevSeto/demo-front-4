import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TitleService } from '../../services/global/title.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../html/help/help.component.html',
    styleUrls: ['../../css/help.component.css']
})

export class HelpComponent implements OnInit {

    public activeTab: any = [];

    // TODO Get questions from backend
    public questions: object = [
        {
            id       : 1,
            question : '1) Lorem Ipsum is simply dummy text of the printing and typesetting industry?',
            answer   : '<p>\n' +
                            'There are many variations of passages of Lorem Ipsum available, but the majority have suffered\n' +
                            'alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.\n' +
                            'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing\n' +
                            'hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks\n' +
                            'as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words,\n' +
                            'combined with a handful of model sentence structures,\n' +
                            'to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free\n' +
                            'from repetition, injected humour, or non-characteristic words etc.\n' +
                        '</p>\n' +
                        '<p>\n' +
                            'There are many variations of passages of Lorem Ipsum available, but the majority have suffered\n' +
                            'alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.\n' +
                            'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing\n' +
                            'hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks\n' +
                            'as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words,\n' +
                            'combined with a handful of model sentence structures,\n' +
                            'to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free\n' +
                            'from repetition, injected humour, or non-characteristic words etc.\n' +
                        '</p>'
        },
        {
            id       : 2,
            question : '2) Lorem Ipsum is simply dummy text of the printing and typesetting industry?',
            answer   : '<p>\n' +
                            'There are many variations of passages of Lorem Ipsum available, but the majority have suffered\n' +
                            'alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.\n' +
                            'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing\n' +
                            'hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks\n' +
                            'as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words,\n' +
                            'combined with a handful of model sentence structures,\n' +
                            'to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free\n' +
                            'from repetition, injected humour, or non-characteristic words etc.\n' +
                        '</p>\n' +
                        '<p>\n' +
                            'There are many variations of passages of Lorem Ipsum available, but the majority have suffered\n' +
                            'alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.\n' +
                            'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing\n' +
                            'hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks\n' +
                            'as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words,\n' +
                            'combined with a handful of model sentence structures,\n' +
                            'to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free\n' +
                            'from repetition, injected humour, or non-characteristic words etc.\n' +
                        '</p>'
        },
        {
            id       : 3,
            question : '3) Lorem Ipsum is simply dummy text of the printing and typesetting industry?',
            answer   : '<p>\n' +
                            'There are many variations of passages of Lorem Ipsum available, but the majority have suffered\n' +
                            'alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.\n' +
                            'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing\n' +
                            'hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks\n' +
                            'as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words,\n' +
                            'combined with a handful of model sentence structures,\n' +
                            'to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free\n' +
                            'from repetition, injected humour, or non-characteristic words etc.\n' +
                        '</p>\n' +
                        '<p>\n' +
                            'There are many variations of passages of Lorem Ipsum available, but the majority have suffered\n' +
                            'alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.\n' +
                            'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing\n' +
                            'hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks\n' +
                            'as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words,\n' +
                            'combined with a handful of model sentence structures,\n' +
                            'to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free\n' +
                            'from repetition, injected humour, or non-characteristic words etc.\n' +
                        '</p>'
        },
        {
            id       : 4,
            question : '4) Lorem Ipsum is simply dummy text of the printing and typesetting industry?',
            answer   : '<p>\n' +
                            'There are many variations of passages of Lorem Ipsum available, but the majority have suffered\n' +
                            'alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.\n' +
                            'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing\n' +
                            'hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks\n' +
                            'as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words,\n' +
                            'combined with a handful of model sentence structures,\n' +
                            'to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free\n' +
                            'from repetition, injected humour, or non-characteristic words etc.\n' +
                        '</p>\n' +
                        '<p>\n' +
                            'There are many variations of passages of Lorem Ipsum available, but the majority have suffered\n' +
                            'alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.\n' +
                            'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing\n' +
                            'hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks\n' +
                            'as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words,\n' +
                            'combined with a handful of model sentence structures,\n' +
                            'to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free\n' +
                            'from repetition, injected humour, or non-characteristic words etc.\n' +
                        '</p>'
        }
    ];

    constructor(
        private titleService: TitleService
    ) {}

    ngOnInit() {
        this.titleService.setPageTitle('help.page_title');
    }

    public setTab(id: number) {
        if(this.activeTab.indexOf(id) !== -1) {
            const index: number = this.activeTab.indexOf(id);
            this.activeTab.splice(index, 1);
        } else {
            this.activeTab.push(id);
        }
    }
}
