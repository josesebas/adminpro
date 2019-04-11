import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';
import {map} from 'rxjs/operators'; 
import {Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {GLOBAL} from './global';

@Injectable()
export class OperacionesViajesService {
	public url:string;
	constructor(public _http:HttpClient) {
		this.url=GLOBAL.url;
	}
	
	/*asignarViaje():Observable<any>{
		return this._http.get(this.url+ 'getOperadores');
	}*/
	asignarViaje(id_viaje, id_unidad, id_operador):Observable<any>{
		let json = JSON.stringify({'id_viaje':id_viaje, 'id_unidad':id_unidad, 'id_operador':id_operador});
		var params = "asignar="+json;
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.post(this.url+'asignarViaje', params, {headers});
	}
	reasignarViaje(id_viaje, id_unidad, id_operador, num_contrato, id_dividido):Observable<any>{
		let json = JSON.stringify({'id_viaje':id_viaje, 'id_unidad':id_unidad, 'id_operador':id_operador,'num_contrato':num_contrato, 'id_dividido':id_dividido});
		var params = "reasignar="+json;
		console.log(params);
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.post(this.url+'reasignarViaje', params, {headers});	
	}
	dividirViaje(data_principal, data_divisiones):Observable<any>{
		let json = JSON.stringify({'data_principal':data_principal,'data_divisiones':data_divisiones});
		var params = "dividir="+json;
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.post(this.url+'dividirViaje', params, {headers});
	}
	editarDivisiones(data_principal, data_divisiones):Observable<any>{
		let json = JSON.stringify({'data_principal':data_principal,'data_divisiones':data_divisiones});
		var params = "divisiones="+json;
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.post(this.url+'editarDivisiones', params, {headers});
	}
	getDivisiones(id_viaje):Observable<any>{
		let json = JSON.stringify({'id_viaje':id_viaje});
		var params = "viaje="+json;
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.post(this.url+'getDivisiones', params, {headers});
	}
	getMovimiento(inicio, fin, id_viaje):Observable<any>{
		let json = JSON.stringify({'id_viaje': id_viaje,'inicio':inicio,'fin':fin});
		var params = "viaje="+json;
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.post(this.url+'getMovimientos', params, {headers});
	}
	iniciarViaje(id_viaje,num_contrato):Observable<any>{
		let json = JSON.stringify({'id_viaje': id_viaje,'num_contrato':num_contrato});
		var params = "viaje="+json;
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.post(this.url+'iniciarViaje', params, {headers});
	}
}