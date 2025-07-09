import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/items',
    pathMatch: 'full'
  },
  {
    path: 'items',
    loadComponent: () => import('./components/item-list/item-list.component').then(m => m.ItemListComponent)
  },
  {
    path: '**',
    redirectTo: '/items'
  }
];
