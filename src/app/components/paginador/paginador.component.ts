import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
  styleUrls: ['./paginador.component.css']
})
export class PaginadorComponent implements OnInit, OnChanges {
	items=[];
	cantidad_pagina=50;
	inicio= 0;
	fin = 0;
	paginas=0;
	pagina_actual=1;
	tab_actual;
	@Input() total_registros:number;
	@Input() cantidad_registros:number;
	@Output() registros_pagina:EventEmitter<any>=new EventEmitter();

  constructor(private rutaActiva: ActivatedRoute) { 
  	this.rutaActiva.params.subscribe(
        params=>{
          if(params.tab) {
            if(this.tab_actual != params.tab) {
            	this.pagina_actual= 1;
            }
            this.tab_actual = params.tab;
          } 
          //console.log(params.tab);
          
      });
  }

  ngOnInit() {

  }
  ngOnChanges(changes:SimpleChanges){
  	let temp : SimpleChange = changes.total_registros;
  	let temp2 : SimpleChange = changes.cantidad_registros;

  	if(temp) {
  		//console.log(temp);
  	  	this.paginador();
    }else if(temp2){
    	this.paginador();
    }
  }
  lanzarCantidadPagina(){
  	this.pagina_actual = 1;
  	this.registros_pagina.emit({cantidad:this.cantidad_pagina, pagina:this.pagina_actual});
  }
  paginador(){
  	this.paginas = this.total_registros / this.cantidad_pagina;
  	this.items = [];
  	this.paginas = Math.ceil(this.paginas);
  	//console.log("pagina actual "+this.pagina_actual);
  	//console.log("cantidad paginas en paginador "+this.paginas);
  	for (var j = this.pagina_actual-4; j < this.pagina_actual+5; j++) {
  		//console.log("analizando "+j);
  		if(j>0 && j<=this.paginas) {
  			this.items.push({id:j});
  		}
  		
  	}
  	/*
  	for (var i = 0; i < this.pagina_ac; ++i) {
  		this.items.push({id:i+1});
  	}*/
  	//console.log(this.items);
  	if(this.total_registros>0) {
  		this.inicio = ((this.pagina_actual-1)*this.cantidad_pagina)+1
	  	//console.log("inicio "+this.inicio);
	  	this.fin = this.inicio + this.cantidad_registros-1;
	  	//console.log("fin "+this.fin);
  	}else{
  		this.inicio = 0;
  		this.fin = 0;
  	}
  	
  }

  cambiarPagina(nueva){
  	if(nueva < 1 ) {
  		// code...
  	}else if(nueva<=this.paginas){
  		
  		this.pagina_actual = nueva;
	  	this.paginador();
	  	this.registros_pagina.emit({cantidad:this.cantidad_pagina, pagina:this.pagina_actual});
  	}
  }

}
