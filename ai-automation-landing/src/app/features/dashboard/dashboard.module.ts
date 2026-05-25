import { NgModule } from '@angular/core';

import { DASHBOARD_ROUTES } from './dashboard.routes';

/**
 * Logical feature boundary for dashboard standalone routes/components.
 */
@NgModule({})
export class DashboardModule {
  static readonly routes = DASHBOARD_ROUTES;
}
