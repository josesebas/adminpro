import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import {Router,ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';
import { FiltrosServices } from '../../services/filtros.service';
//import {WebsocketService} from '../../services/websocket.service';
//import {ChatService} from '../../services/chat.service';
import {Subscription} from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  tipo_filtro = "todos";
  filtro = "na";
	tab="x_asignar"
	texto="";
  pagina = 1;
  cantidad=50;
  total_registros;
  cantidad_registros;
  //@Output() cantidad:EventEmitter<any>=new EventEmitter();
	//mensajesSubscription:Subscription;
	mensajes:any[]=[];
  constructor(
    private _filtros:FiltrosServices, private rutaActiva: ActivatedRoute,   private _router: Router, location: Location
    // public wsService:WebsocketService,
  	//public chatService:ChatService
  	){
      this.rutaActiva.params.subscribe(
        params=>{
          if(params.tab) {
            this.tab = params.tab;
          }
          
          
          //console.log(params.tab);
          
      });
    }

  ngOnInit() {
  	// this.mensajesSubscription=this.chatService.getMessages().subscribe(msg=>{
  	// 	this.mensajes.push(msg);
  	// });
  }
  ngOnDestroy(){
  	// this.mensajesSubscription.unsubscribe();
  }
  showFiltro(event){
    this.tipo_filtro = event.tipo;
    this.filtro = event.filtro;
    if(this.tipo_filtro =='todos') {
      
    }else{

    }
    
  }
  showPagina(event){
    //console.log(event);
    this.pagina = event.pagina;
    this.cantidad = event.cantidad;
  }
  lanzarTotales(event){
    document.getElementsByClassName("page-wrapper")[0].scrollIntoView();
    this.total_registros = event.total_registros;
    this.cantidad_registros = event.cantidad_registros;
    
  }
  // enviar(){
  // 	if(this.texto.length) {
  // 		this.chatService.sendMessage(this.texto);
  // 		this.texto="";
  // 	}
  //
  // }

}
