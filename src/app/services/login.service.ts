import {Injectable} from '@angular/core';
//import {Http, Response, Headers, RequestOptions, HttpRequest, htt} from '@angular/common/http';
import {HttpClient,HttpHeaders,HttpRequest, HttpResponse}from '@angular/common/http';
import {map} from 'rxjs/operators'; 
import {Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {GLOBAL} from './global';


@Injectable()
export class LoginService{
	public url:string;
	

	constructor(public _http:HttpClient){
		this.url=GLOBAL.url;
	}
	logear(usuario, contrasena):Observable<any>{
		var json = JSON.stringify({'usuario':usuario,'contrasena':contrasena});
		var params = "log="+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.post(this.url+'logear', params, {headers});
	}
	
}

