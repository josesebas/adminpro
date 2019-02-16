import { NgModule } from '@angular/core';

import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { ProgressComponent } from '../pages/progress/progress.component';
import { Graficas1Component } from '../pages/graficas1/graficas1.component';
import { PagesComponent } from '../pages/pages.component';

import { PAGES_ROUTES } from '../pages/pages.routes';
import { SharedModule } from '../shared/shared.module';
@NgModule({
	declarations:[
		DashboardComponent,
	    ProgressComponent,
	    Graficas1Component,
	    PagesComponent
	],
	exports:[
		DashboardComponent,
	    ProgressComponent,
	    Graficas1Component,
	    PagesComponent
	],
	imports:[
		SharedModule,
		PAGES_ROUTES
	]
})
export class PagesModule{}