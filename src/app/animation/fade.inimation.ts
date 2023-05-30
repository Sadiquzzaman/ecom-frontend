import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fade = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(1.01)' }),
    animate('1.2s', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
  transition(':leave', [animate('0.6s', style({ opacity: 0 }))]),
]);

export const zoom = trigger('zoom', [
  state('zoomIn', style({ transform: 'scale(1.05)' })),
  state('zoomOut', style({ transform: 'scale(1)' })),
  transition('zoomIn <=> zoomOut', [animate('0.6s')]),
]);

export const promo_fade = trigger('promo_fade', [
  state('fadeIn', style({ opacity: 1, transform: 'scale(1)' })),
  state('fadeOut', style({ opacity: 0, transform: 'scale(0.9)' })),
  transition('fadeIn <=> fadeOut', [animate('1.5s')]),
]);

export const promo_cat_fade = trigger('promo_cat_fade', [
  state('fadeIn', style({ opacity: 1, transform: 'scale(1)' })),
  state('fadeOut', style({ opacity: 0, transform: 'scale(0.9)' })),
  transition('fadeIn <=> fadeOut', [animate('1.2s')]),
]);

export const promo_zoom = trigger('promo_zoom', [
  state('zoomIn', style({ transform: 'scale(1.05)' })),
  state('zoomOut', style({ transform: 'scale(1)' })),
  transition('zoomIn <=> zoomOut', [animate('0.6s')]),
]);
