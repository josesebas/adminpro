import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $:any;
declare var swal:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario="";
	contrasena="";
  encontrado=false;
  constructor(private _loginService:LoginService, private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {
    this.usuario = localStorage.getItem('user');
    if(this.usuario) {
      //console.log("Ya existe un usuario");
      this._router.navigate(["/dashboard"]);
    }else{
      console.log("No existe un usuario");
    }
  }

  logear(){
    if(this.usuario && this.contrasena){
      this._loginService.logear(this.usuario, this.contrasena).subscribe(
        res=>{
          if(res.code==200) {
            console.log("encontrado");
            this.encontrado = true;
            console.log(res.usuario);
            localStorage.setItem('user', JSON.stringify(res.usuario));
            this._router.navigate(["/dashboard"]);

          }else{
            console.log("no encontrado");
            $('#user').val('');
            swal({
						  position: 'middle-center',
						  type: 'error',
						  title: 'Contraseña o Usuario incorrecto.',
						  showConfirmButton: false,
						  timer: 2000
						});
          }
        },err=>{
          console.log(err);
          swal({
						  position: 'middle-center',
						  type: 'error',
						  title: 'Ocurrio un error.',
						  showConfirmButton: false,
						  timer: 2000
						})
        });

    }

  }
}
