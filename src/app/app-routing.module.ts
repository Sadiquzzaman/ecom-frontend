import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { CategoryResolveService } from './core/services/category-resolve.service';
import { LoaderService } from './core/services/loader.service';

var categories = null;
LoaderService.categories.subscribe((res) => {
  if (res) {
    categories = res;
  }
});

const routes: Routes = [
  {
    path: 'auth',
    canActivateChild: [],
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    runGuardsAndResolvers: 'always',
  },
  {
    path: '',
    canActivateChild: [],
    resolve: {
      ...(!categories ? { categories: CategoryResolveService } : {}),
    },
    loadChildren: () =>
      import('./features/site/site.module').then((m) => m.SiteModule),
  },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
