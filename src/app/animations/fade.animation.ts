import { trigger, animate, transition, style, state, group } from '@angular/animations';

export const fadeAnimation =
    trigger('fadeAnimation', [
        state('in', style({
           'opacity': '1', 'visibility': 'visible'
        })),

        state('out', style({
            'opacity': '0', 'visibility': 'hidden'
        })),

        transition('in => out', [group([
                animate('.1s', style({
                    'opacity': '0'
                })),
                animate('.1s', style({
                    'visibility': 'hidden'
                }))
            ]
        )]),
        transition('out => in', [group([
                animate('.1s', style({
                    'visibility': 'visible'
                })),
                animate('.1s', style({
                    'opacity': '1'
                }))
            ]
        )])
    ]);
