import { Component, OnInit } from '@angular/core';
import {Input,Output,EventEmitter, ViewChild, ElementRef} from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {
	@Input() porcentaje:number=5;
	@Input() leyenda="Leyenda";
	@Output() cambioValor:EventEmitter<number>=new EventEmitter();
  @ViewChild('txtProgress') txtProgress:ElementRef; 
  constructor() { }

  ngOnInit() {
  }
  onChanges(nuevoValor:number){
    if(nuevoValor>=100) {
      this.porcentaje=100;
    }else if(nuevoValor<=0){
      this.porcentaje=0;
    }else{
      this.porcentaje=nuevoValor;
    }

    this.txtProgress.nativeElement.value = this.porcentaje;
    this.cambioValor.emit(this.porcentaje);
    this.txtProgress.nativeElement.focus();
  }
  cambiarValor(valor:number){
  	if(valor>0 && this.porcentaje>=100) {
  		this.porcentaje=100;
  	  return;
    }else if(this.porcentaje<=0 && valor<0){
  		this.porcentaje=0;
      return;
  	}
      this.porcentaje+=valor;

    
  	this.cambioValor.emit(this.porcentaje);
  }

}
