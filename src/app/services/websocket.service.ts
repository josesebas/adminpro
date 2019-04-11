// import { Injectable } from '@angular/core';
// import {Socket} from 'ngx-socket-io'
// @Injectable({
//   providedIn: 'root'
// })
// export class WebsocketService {
// 	public socketStatus = false;
//   constructor(private socket:Socket) {
//   	this.checkStatus();
//   }
//   checkStatus(){
//   	this.socket.on('connect',()=>{
//   		console.log('conectado al servidor');
//   		this.socketStatus=true;
//   	});
//   	this.socket.on('disconnect',()=>{
//   		console.log('desconectado al servidor');
//   		this.socketStatus=false;
//   	});
//   }
//
//   //metodos para usar en la aplicacion
//   emit(evento:string, payload?:any, callback?:Function){
//   	//emit('EVENTO', payload, callback)
//   	console.log("emitiendo ",evento);
//   	this.socket.emit(evento, payload, callback);//disparar un evento al servidor
//   }
//   listen(evento:string){
//   	return this.socket.fromEvent(evento);
//   }
// }
