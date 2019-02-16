import { NgModule } from '@angular/core';

import { BreadcrumbsComponent } from '../shared/breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from '../shared/header/header.component';
import { NopagefoundComponent } from '../shared/nopagefound/nopagefound.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@NgModule({
	declarations:[
		BreadcrumbsComponent,
		HeaderComponent,
		NopagefoundComponent,
		SidebarComponent
	],
	exports:[
		BreadcrumbsComponent,
		HeaderComponent,
		NopagefoundComponent,
		SidebarComponent
	]
})
export class SharedModule{}