import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/calendar',
        pathMatch: 'full',
    },
    // {
    //     path: 'calendar',
    //     loadComponent: () => import('../../projects/calendar/src/lib/main/main').then(m => m.Main),
    // },
    // {
    //    path: '**',
    //    loadComponent: () => import('@shared/ui/not-found').then(m => m.NotFound),
    // },
];