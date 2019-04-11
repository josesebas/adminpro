import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [`
	.mini-sidebar{
		width:70px;
	}
	.text-gdl{
		color:#D0AC12;
	}
  `]
})
export class SidebarComponent implements OnInit {
	seleccionado=0;
  constructor() { }

  ngOnInit() {
  }
  expandir(option){
  	if(this.seleccionado==option) {
  		$('.contenedor').css('display','none');
      $('.page-wrapper').css('margin-left',70);
  		//$('.mini-sidebar').css('width',70);
  		option=0;
  	}else{
  		$('.contenedor').css('display','block');
      $('.page-wrapper').css('margin-left',460);
  		//$('.mini-sidebar').css('width',700);
  	}
  	this.seleccionado=option;
  	
  }


}
