import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import {FiltrosServices} from '../../services/filtros.service';
import {ActivatedRoute, Router} from '@angular/router';
declare var moment:any;

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css']
})
export class FiltrosComponent implements OnInit {
	//hacer inputs o outputs
	filtro="";
	operadores;
	operador="";
	unidades;
	unidad="";
	cliente;
	sucursales;
	sucursal="";
	fecha1="";
	fecha2="";
	data="";
	@Output() tipoFiltro:EventEmitter<any> = new EventEmitter();
	@Output() valor:EventEmitter<string> = new EventEmitter();
	myOptions: INgxMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
    };
    model: any = { date: { year: moment().format('YYYY'), month: 1, day: 1 } };
    model2: any = { date: { year: moment().format('YYYY'), month: 1, day: 1 } };
  constructor(private _filtros: FiltrosServices,private _route: ActivatedRoute,
		private _router: Router) { }

  ngOnInit() {
  }
  onDateChanged(event: IMyDateModel,tipo): void {
        if(tipo==2) {
        	this.fecha2 = event.formatted;
        }else if(tipo==1){
        	this.fecha1   = event.formatted;
        }
        //console.log(this.fecha1 + " - " + this.fecha2);
    }
   cargarFiltros(){
   	if(this.filtro == 'operador') {
   		this._filtros.getOperadores().subscribe(
   			response=>{
   				//console.log(response);
   				this.operadores = response.data;
   			},error=>{
   				console.log(error);
   			});
   	}else if(this.filtro== 'unidad'){
   		this._filtros.getUnidades().subscribe(
   			response=>{
   				this.unidades = response.data;
   			},error=>{
   				console.log(error);
   			})
   	}else if(this.filtro== 'sucursal'){
   		this._filtros.getSucursales().subscribe(
   			response=>{
   				this.sucursales = response.data;
   			},error=>{
   				console.log(error);
   			})
   	}
   }
  filtrar(event){
  	if(this.filtro =='operador') {
  		//console.log(this.operador);
		this.data = this.operador; 
  	}else if(this.filtro =='unidad') {
  		//console.log(this.unidad);
  		this.data = this.unidad;
  	}else if(this.filtro =='cliente') {
  		//console.log(this.cliente);
  		this.data = this.cliente;
  	}else if(this.filtro =='sucursal') {
  		//console.log(this.sucursal);
  		this.data = this.sucursal;
  	}else if(this.filtro =='fecha') {
  		//console.log(this.fecha1+"-"+this.fecha2);
      this.data = this.fecha1+"a"+this.fecha2;
      if(this.fecha1.length ==0 || this.fecha2.length==0) {
        this.data =""
      }
  		
  	}
    if(this.data) {
      this.tipoFiltro.emit({tipo:this.filtro,filtro:this.data});
    }
  	
  }
  desfiltrar(){
  	this.filtro = "";
    this.cliente="";
  	this.tipoFiltro.emit({tipo:"todos", filtro:"na"});
    console.log(this.tipoFiltro);
  }

}
