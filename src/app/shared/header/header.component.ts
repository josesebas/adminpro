import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
	usuario:any;
	nombre;
	email;
	img_user;
  constructor(private _router:Router) { 

  }

  ngOnInit() {
  	this.usuario=  JSON.parse(localStorage.getItem('user')); 	
  	if(this.usuario) {
  		this.img_user= 'https://www.gdlvan.com.mx/files/users/'+this.usuario.img_perfil;
  		this.nombre= this.usuario.nombre;
  		this.email=this.usuario.email; 
   	}else{
 		this._router.navigate(["/login"]); 		
  	}
  }
  logout(){
  	localStorage.removeItem('user');
  	this._router.navigate(["/login"]); 	
  }
}
