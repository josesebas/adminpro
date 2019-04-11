import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders}from '@angular/common/http';
import {map} from 'rxjs/operators'; 
import {Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {GLOBAL} from './global';

@Injectable()
export class FiltrosServices{
	public url:string;
	constructor(public _http:HttpClient) {
		this.url=GLOBAL.url;
	}
	
	/*post():Observable<any>{
		let json = JSON.stringify({'id_viaje':viaje,'codigo':codigo,'monto':monto,'minimo':minimo, 'id_encuesta':id_encuesta});
		var params = "envio="+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.post(this.url+'enviarCupon', params, {headers});		
	}*/
	getOperadores():Observable<any>{
		return this._http.get(this.url+ 'getOperadores');
	}
	getOperador(id):Observable<any>{
		return this._http.get(this.url+ 'getOperador/'+id);
	}
	getUnidades():Observable<any>{
		return this._http.get(this.url+ 'getUnidades');
	}
	getSucursales():Observable<any>{
		return this._http.get(this.url+ 'getSucursales');
	}
	getSeguimiento(tab, tipoFiltro, filtro, pagina, cantidad, sucursal):Observable<any>{
		let json = JSON.stringify({'tab':tab,'tipoFiltro':tipoFiltro,'filtro':filtro, 'pagina':pagina, 'cantidad':cantidad, 'sucursal':sucursal});
		var params = "seguimiento="+json;
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.post(this.url+'getSeguimiento', params, {headers});
	}
	getDiasMovimientos(id):Observable<any>{
		let json = JSON.stringify({'id':id});
		var params = "diasMov="+json;
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.post(this.url+'getDiasMovimientos', params, {headers});
	}
}