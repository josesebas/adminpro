import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }from '@angular/forms';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { NgSelectModule } from '@ng-select/ng-select';

import {SliceTooltipPipe} from '../pipes/slice-tooltip.pipe';

import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { ProgressComponent } from '../pages/progress/progress.component';
import { Graficas1Component } from '../pages/graficas1/graficas1.component';
import { PagesComponent } from '../pages/pages.component';
import { FiltrosComponent } from '../components/filtros/filtros.component';
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { TablaSeguimientoComponent } from '../components/tabla-seguimiento/tabla-seguimiento.component';
import { PaginadorComponent } from '../components/paginador/paginador.component';


import { PAGES_ROUTES } from '../pages/pages.routes';
import { SharedModule } from '../shared/shared.module';


import { FiltrosServices } from '../services/filtros.service';
import { OperacionesViajesService } from '../services/operaciones-viajes.service';

@NgModule({
	declarations:[
		DashboardComponent,
	    ProgressComponent,
	    Graficas1Component,
	    PagesComponent,
	    IncrementadorComponent,
	    FiltrosComponent,
	    TablaSeguimientoComponent,
	    PaginadorComponent,
	    SliceTooltipPipe

	],
	exports:[
		DashboardComponent,
	    ProgressComponent,
	    Graficas1Component,
	    PagesComponent,
	    FiltrosComponent,
	    TablaSeguimientoComponent,
	    PaginadorComponent
	],
	imports:[
		SharedModule,
		BrowserModule,
		PAGES_ROUTES,
		FormsModule,
		NgxMyDatePickerModule.forRoot(),
		NgSelectModule,
		MyDateRangePickerModule
	],
	providers:[
		FiltrosServices,
		OperacionesViajesService
	]
})
export class PagesModule{}