import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FiltrosServices } from '../../services/filtros.service';
import { OperacionesViajesService } from '../../services/operaciones-viajes.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {IMyDrpOptions, IMyDateSelected} from 'mydaterangepicker';
declare var moment:any;
declare var $:any;
declare var swal:any;

@Component({
  selector: 'app-tabla-seguimiento',
  templateUrl: './tabla-seguimiento.component.html',
  styleUrls: ['./tabla-seguimiento.component.css']
})
export class TablaSeguimientoComponent implements  OnChanges, OnInit {
	@Input() tipoFiltro:string="todos";
	@Input() filtro:string="na";
	@Input() tab:string;
  @Input() pagina:number=1;
  @Input() cantidad:number=50;
  @Output() total:EventEmitter<any> = new EventEmitter();
  total_gral;
  viajes;
  sucursal;
  operador;
  unidad_sel=[];
  unidades=[];
  operador_sel=[];
  operadores=[];
  tipos_divisiones;
  tipo_division_sel;
  dividiendo;
  limite_salida=[];
  limite_regreso=[];
  unidad_principal;
  operador_principal;
  model_principal;
  model=[];//para las fechas
  unidad_division=[];
  operador_division=[];
  salida_exacta=[];
  tipos_division=[];
  cantidad_divisiones=0;
  cantidad_divisiones_iniciados = 0;
  cantidad_divisiones_asignados = 0;
  cantidad_divisiones_options=[];
  viaje_actual :any;
  divisiones:any[]=[];
  datos_faltantes;
  checkSalida = false;
  faltan_datos =false;
  consecutivos=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  constructor(private _filtrar: FiltrosServices, private _operaciones: OperacionesViajesService, private modalService: NgbModal) {
    this.sucursal=  JSON.parse(localStorage.getItem('user')).sucursal;
   }
   myDateRangePickerOptions: IMyDrpOptions = {
        dayLabels: { su: "Do", mo: "Lu", tu: "Ma", we: "Mi", th: "Ju", fr: "Vi", sa: "Sa" },
        monthLabels: { 1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic" },
        firstDayOfWeek: "mo",
        dateFormat: 'yyyy-mm-dd',
        showClearBtn:false,
        markCurrentDay:true,
        width: '190px',
        editableDateRangeField:false,
        disableUntil:{
          year:this.limite_salida[0], month:this.limite_salida[1], day:this.limite_salida[2]
        },
        disableSince:{
           year:this.limite_regreso[0], month:this.limite_regreso[1], day:this.limite_regreso[2]
        }
    };

  ngOnInit() {
  	//console.log('consultar a '+this.tab+" con filtros "+this.tipoFiltro+" "+this.filtro);
   this._filtrar.getUnidades().subscribe(
     res=>{
       //console.log(res);
       this.unidades =res.data;
     },error=>{
       console.log(error);
     });
    this._filtrar.getOperadores().subscribe(
      resp=>{
        this.operadores=resp.data;
      },error=>{
        console.log(error);
      });
  }
  ngOnChanges(changes:SimpleChanges){
  	let temp : SimpleChange = changes.tipoFiltro;
  	let temp2 : SimpleChange = changes.filtro;
  	let temp3 : SimpleChange = changes.tab;
  	let temp4 : SimpleChange = changes.pagina;
    let temp5 :SimpleChange = changes.cantidad;
  	if(temp2) {
  		//console.log("cambio en filtro");
  	  this.pagina=1;
      console.log('consultar a '+this.tab+" con filtros "+this.tipoFiltro+" "+this.filtro+" pagina "+this.pagina +" cantidad "+this.cantidad);
      this.cargarDatos();
    }else if(temp3) {
  		//console.log("cambio en tab");
       this.pagina=1;
      console.log('consultar a '+this.tab+" con filtros "+this.tipoFiltro+" "+this.filtro+" pagina "+this.pagina +" cantidad "+this.cantidad);
  	  this.cargarDatos();
    }else if(temp4){
      //console.log("camibio de pagina");
      console.log("consultar a "+ this.tab+" con filtros "+ this.tipoFiltro+" "+this.filtro+" pagina "+this.pagina +" cantidad "+this.cantidad);
      this.cargarDatos();
    }else if(temp5){
      //console.log("camibio de cantidad");
      this.pagina=1;
      console.log("consultar a "+ this.tab+" con filtros "+ this.tipoFiltro+" "+this.filtro+" pagina "+this.pagina +" cantidad "+this.cantidad);
      this.cargarDatos();
    }
  }
  activarTooltip(){
    $('[data-toggle="tooltip"]').tooltip()
  }
  cargarDatos(){
    this.viajes = [];
    this.operador_sel=[];
    this.unidad_sel=[];
    this._filtrar.getSeguimiento(this.tab, this.tipoFiltro, this.filtro, this.pagina, this.cantidad, this.sucursal).subscribe(
      response=>{
        //console.log(response);
        this.viajes  = response.data;
        if(this.tab=='x_asignar') {
         for (var i = 0; i < this.viajes.length; ++i) {
            this.operador_sel.push({'id':null, 'nombre':this.viajes[i].nombre_operador});  
            this.unidad_sel.push(null);
          }
        }else{
          for (var i = 0; i < this.viajes.length; ++i) {
            this.operador_sel.push({'id':this.viajes[i].id_operador, 'nombre':this.viajes[i].nombre_operador});  
            this.unidad_sel.push({'id':this.viajes[i].id_unidad, 'num_economico':this.viajes[i].num_economico});
          }
        }
        this.total_gral = response.total;
        this.emitirTotal(response.total, response.cantidad);
       //console.log(this.viajes);
        //console.log(this.operador_sel);
      },error=>{

        console.log(error);
      });
  }
  emitirTotal(total, cantidad){
    this.total.emit({total_registros:total, cantidad_registros:cantidad});

  }
  asignar_u(index){
    //console.log(this.contratos[index]);
    //let select = $('#asignar_unidad'+index).val();
    let select = this.unidad_sel[index].id;
    //console.log(this.unidades[select]);
    let p = new Promise((resolve, reject)=>{
      this._filtrar.getOperador(select).subscribe(
      resp=>{
        //console.log(resp);
        if(resp.code==200) {
          this.operador_sel[index]=resp.data;
          //console.log(this.operador_sel[index]);
        }else{
          
        }
        resolve(this.operador_sel[index]);
      },error=>{
        console.log(error);
        reject(error);
      });  
    });
  }

  asignar_viaje(index){
    //console.log(this.viajes[index]);
    let select = this.unidad_sel[index].id;
    //console.log(select);
    let select2 = this.operador_sel[index].id;
    //console.log(select2);
    if(select && select2) {
      let promesa = new Promise((resolve, reject)=>{
        this._operaciones.asignarViaje(this.viajes[index].id, select, select2).subscribe(
          res=>{
            resolve(res);
          },error=>{

            reject(error);
          });  
      }).then((respuesta:any)=>{
        if(respuesta.code ==200) {
          this.viajes.splice(index,1);
          this.unidad_sel[index]=null;
          this.operador_sel[index]=null;
          this.total_gral--;
          this.emitirTotal(this.total_gral, this.viajes.length);
          swal.fire({
            title:'Asignado',
            text:'Se ha asignado el viaje con exito!',
            type:'success'
          })
        }else{
          swal.fire({
            title:'Error',
            text:'No se ha asignado el viaje!',
            type:'error'
          })
        }
          
      });
      
    }else{
       let falta="";
      if(select) {
        falta = "operador"
      }else{
        falta = "unidad"
      }
      swal.fire({
        type:'warning',
        text:'No haz seleccionado '+falta+'!',
        title:'Advertencia'
      })
    }
  }
  reasignar_viaje(index){
    let select = this.unidad_sel[index].id;
    let select2 = this.operador_sel[index].id;
    if(select && select2) {
      if(select == this.viajes[index].id_unidad && select2==this.viajes[index].id_operador) {
        swal.fire({
          type:'warning',
          text:'No se han modificado los datos!',
          title:'Advertencia'
        })
      }else{
        let promesa = new Promise((resolve, reject)=>{
          console.log("reasignar", this.viajes[index]);
          this._operaciones.reasignarViaje(this.viajes[index].id, select, select2, this.viajes[index].num_contrato, this.viajes[index].dividido).subscribe(
            res=>{
              resolve(res);
            },error=>{

              reject(error);
            });  
        }).then((respuesta:any)=>{
          if(respuesta.code ==200) {
            this.viajes[index].id_operador =this.operador_sel[index].id;
            this.viajes[index].nombre_operador=this.operador_sel[index].nombre;
            this.viajes[index].id_unidad=this.unidad_sel[index].id;
            this.viajes[index].num_economico= this.unidad_sel[index].num_economico;
            swal.fire({
              title:'Asignado',
              text:'Se ha asignado el viaje con exito!',
              type:'success'
            })
          }else{
            swal.fire({
              title:'Error',
              text:'No se ha asignado el viaje!',
              type:'error'
            })
          }
            
        });
      }
      
    }else{
       let falta="";
      if(select) {
        falta = "operador"
      }else{
        falta = "unidad"
      }
      swal.fire({
        type:'warning',
        text:'No haz seleccionado '+falta+'!',
        title:'Advertencia'
      })
    }
  }
  abrirModal(content, i, tipo){
      if(tipo == 1) {
        this.openModal(content, i); 
      }else if(tipo==2){
        this.openModal2(content, i); 
      }
       
    
  }
  openModal(content,index) {
    this.divisiones=[];
    this.faltan_datos= false;
    this.dividiendo=index;
    this.operador_principal ={'id':this.viajes[this.dividiendo].id_operador ,'nombre':this.viajes[this.dividiendo].nombre_operador};
    this.unidad_principal = {'id':this.viajes[this.dividiendo].id_unidad ,'num_economico':this.viajes[this.dividiendo].num_economico};
    console.log(this.viajes[this.dividiendo]);
        this.cantidad_divisiones = 0;
        this.divisiones=[];
        this.tipo_division_sel="";
      if( this.viajes[index].tipo_viaje.toUpperCase()=='TOUR' 
      || this.viajes[index].tipo_viaje.toUpperCase()=='FORANEO SENCILLO' 
      || this.viajes[index].tipo_viaje.toUpperCase()=='TRASLADO DE AEROPUERTO A HOTEL' 
      || this.viajes[index].tipo_viaje.toUpperCase()=='TRASLADO DE HOTEL A AEROPUERTO'  ) {
      this.tipos_divisiones = [
        {'type':'falla','name':'División por cambio de unidad'}
      ]
    }else if(this.viajes[index].tipo_viaje.toUpperCase()=='FORANEO REDONDO S/MOVIMIENTOS'){
      this.tipos_divisiones = [
        {'type':'ida_vuelta','name':'División ida y vuelta'},
        {'type':'falla','name':'División por cambio de unidad'}
      ]
    }else if(this.viajes[index].tipo_viaje.toUpperCase()=='FORANEO REDONDO C/MOVIMIENTOS DE RUTA' 
            ||this.viajes[index].tipo_viaje.toUpperCase()=='FORANEO REDONDO C/MOVIMIENTOS LOCALES' 
            || this.viajes[index].tipo_viaje.toUpperCase()=='LOCAL 1 A 6 HRS' 
            ||this.viajes[index].tipo_viaje.toUpperCase()=='LOCAL 6 HRS O MAS' ){
      this.tipos_divisiones = [
        {'type':'dia','name':'División por días'},
        {'type':'falla','name':'División por cambio de unidad'}
      ]
    }
      this.modalService.open(content, { size: 'lg' });
      $('.modal-content').css('min-width',1050);
      setTimeout(()=>{
        $(".modal-lg").css('max-width',1050);
      },20);

  }
  openModal2(content, index){
    this.tipos_division=[];
    this.divisiones=[];
    this.faltan_datos= false;
    this.dividiendo=index;
    //consultar divisiones
    let prom = new Promise((resolve, reject)=>{
      this._operaciones.getDivisiones(this.viajes[this.dividiendo].id).subscribe(
        response=>{
          console.log(response);
          if(response.code ==200) {
             this.divisiones = response.data;
             this.cantidad_divisiones_asignados = response.inicial_asignados;
             this.cantidad_divisiones_iniciados = response.inicial_iniciados;
             this.operador_principal ={'id':response.principal.id_operador ,'nombre':response.principal.nombre_operador};
             this.unidad_principal = {'id':response.principal.id_unidad ,'num_economico':response.principal.num_economico};
             this.viaje_actual = response.principal;
              /*console.log(this.operador_principal);
              console.log(this.unidad_principal);*/
            resolve(this.divisiones);

          }else{
            reject(response);
          }
        },error=>{
          reject(error);
        });

    }).then((respuesta)=>{
      this.operador_division = [];
      this.unidad_division = [];
      this.model = [];
      for (var i = 0; i < this.divisiones.length; ++i) {
        this.unidad_division.push({'id':this.divisiones[i].id_unidad, 'num_economico':this.divisiones[i].num_economico});
        this.operador_division.push({'id':this.divisiones[i].id_operador, 'nombre':this.divisiones[i].nombre_operador});
        this.tipos_division.push(this.divisiones[i].tipo);

        //inicializar todos los model
        //console.log(this.divisiones[i]);
        /*if(this.divisiones[i].tipo=='dia') {*/
          let temp_model =this.divisiones[i].fechaInicio.split('-');
          let temp_model2=this.divisiones[i].fechaFin.split('-');
          //console.log(temp_model);
          //console.log(temp_model2);
          this.model.push({ 
            beginDate: { year:temp_model[0]*1, month:temp_model[1]*1, day:temp_model[2]*1},
            endDate: {year:temp_model2[0]*1, month:temp_model2[1]*1, day:temp_model2[2]*1}
          });
          if(i ==0) {
            this.model_principal={
            beginDate: { year:0, month:0, day:0},
            endDate: {year:0, month:0, day:0}};
          }
          //console.log(this.model);
        /*}else{
           this.model.push({
              beginDate: { year:0, month:0, day:0},
              endDate: {year:0, month:0, day:0}
           });
          this.model_principal={
          beginDate: { year:0, month:0, day:0},
          endDate: {year:0, month:0, day:0}
        }
      }*/
     //let temp_model = this.viajes[this.dividiendo].fecha_salida;
      
    }
      //console.log(this.operador_division);
      //console.log(this.unidad_division);
      this.cambiar_options_daterange();
      this.modalService.open(content, { size: 'lg' });
      
      $('.modal-content').css('min-width',1050);
      setTimeout(()=>{
        $(".modal-lg").css('max-width',1050);
      },20);

    }).catch((error)=>{  
      console.log(error);
    });
    
  }
  extra_division(){// agregar division extra cuando el viaje ya tiene divisiones
    //asignar consecutivo

    this.divisiones.push({
      'nuevo':1,
      'dividido':0,
      'id':this.viajes[this.dividiendo].id,
      'tipo':null,
      'num_contrato':null,
      'num_contrato_original':this.divisiones[0].num_contrato_original,
      'fecha_salida':this.viajes[this.dividiendo].fecha_salida,
      'fecha_regreso':this.viajes[this.dividiendo].fecha_regreso,
      'division_cancelada':0,
      'cancelado':0,
      'salida_exacta':'',
      'destino_exacto':'',
      'eliminar':0
    });
    this.asignarConsecutivo();
    this.unidad_division.push(null);
    this.operador_division.push(null);
    this.tipos_division.push(null);
    let temp_model =this.viajes[this.dividiendo].fecha_salida.split('-');
    this.model.push({ 
          beginDate: { year:temp_model[0], month:temp_model[1]*1, day:temp_model[2]*1},
          endDate: {year:temp_model[0], month:temp_model[1]*1, day:temp_model[2]*1}
        });
  }
  asignarConsecutivo(){
    let bandera = 0;
    let consecutivo=0;
    for (var i = 0; i < this.divisiones.length; ++i) {
      if( this.divisiones[i].consecutivo=='A') {
        bandera =1;
        consecutivo=0;
      }
      if(bandera>0 && this.divisiones[i].nuevo==1) {
       this.divisiones[i].num_contrato = this.divisiones[i].num_contrato_original + "-" +this.consecutivos[consecutivo];
       consecutivo++; 
      }else if(bandera>0){
        consecutivo++;
      }
    }
  }
  quitarDivision(indice){
    if(this.divisiones[indice].nuevo==1) {
      this.divisiones.splice(indice,1);
      this.unidad_division.splice(indice,1);
      this.operador_division.splice(indice,1);
      this.tipos_division.splice(indice,1);
      this.model.splice(indice,1);
      this.asignarConsecutivo();
    }else{
      this.divisiones[indice].eliminar=1;
    }
  }
  validaDivisiones2(){
    let data_divisiones = [];
    this.faltan_datos = false;
    this.datos_faltantes ="";
    let id_viaje = this.viajes[this.dividiendo].id;

    let data_principal ={'id_viaje':id_viaje, 'tipo_division':null,'operador':this.operador_principal.id, 
    'unidad':this.unidad_principal.id};
    //'fechaInicial':this.model_principal.beginDate, 'fechaFinal':this.model_principal.endDate

      for (var i = 0; i < this.divisiones.length; ++i) {
        if(!this.tipos_division[i] && this.divisiones[i].division_cancelada==0 &&this.divisiones[i].eliminar==0) {
          this.faltan_datos =true;
          this.datos_faltantes+=" tipo division ";
        }else if(this.tipos_division[i]=='dia' && this.divisiones[i].division_cancelada==0 &&this.divisiones[i].eliminar==0) {
          if(!this.operador_division[i]){
            this.faltan_datos = true;
            this.datos_faltantes+=" operador division ";
            console.log("falta operador division");
          }else if(!this.model[i]){
            this.faltan_datos = true;
            this.datos_faltantes+=" model division ";
            console.log("falta fechas division");
          }else if(!this.unidad_division[i]){
            this.faltan_datos = true; 
            this.datos_faltantes+=" unidad division ";
            console.log("falta unidad division");
          }else if(!this.model_principal){
            this.faltan_datos = true;
            this.datos_faltantes+=" model principal ";
            console.log("falta fechas principal");
          }else if(!this.unidad_principal){
            this.faltan_datos = true;
            this.datos_faltantes+=" unidad principal ";
            console.log("falta unidad principal");
          }else if(!this.operador_principal) {
            this.faltan_datos = true;
            this.datos_faltantes+=" operador principal ";
            console.log("falta operador principal");
          } else if(!this.divisiones[i].salida_exacta) {
            this.faltan_datos = true;
            this.datos_faltantes+=" datos de salida ";
            console.log("falta datos de salida");
          }else if(!this.divisiones[i].destino_exacto) {
            this.faltan_datos = true;
            this.datos_faltantes+=" datos de destino ";
            console.log("falta datos de destino");
          }
           data_divisiones.push({
                'nuevo':this.divisiones[i].nuevo,
                'id_dividido':this.divisiones[i].dividido,
                'id_viaje':id_viaje,
                'operador':this.operador_division[i].id, 
                'unidad':this.unidad_division[i].id,
                'fechaInicial':this.model[i].beginDate, 
                'fechaFinal':this.model[i].endDate,
                'lugar_salida':null,
                'hora_salida':null,
                'lugar_regreso':null,
                'hora_regreso':null,
                'salida_exacta':this.quitarAmperson(this.divisiones[i].salida_exacta),
                'destino_exacto':this.quitarAmperson(this.divisiones[i].destino_exacto),
                'tipo_division':this.tipos_division[i],
                'division_cancelada': this.divisiones[i].division_cancelada,
                'num_contrato':this.divisiones[i].num_contrato,
                'eliminar':this.divisiones[i].eliminar
              });
           /*console.log("tipos div "+this.tipos_division[i]);
           console.log("model div "+this.model[i]);
           console.log("unidad div "+this.unidad_division[i]);        
           console.log("operador div "+this.operador_division[i])
           console.log("unidad p "+this.unidad_principal);
           console.log("oper p "+this.operador_principal);  
           console.log("model p "+this.model_principal);*/ 
        }else{
          if(!this.operador_principal){
            this.faltan_datos =true;        
            this.datos_faltantes+=" operador principal ";
            console.log("falta operador principal");
          }else if(!this.model[i]){
            this.faltan_datos = true;
            this.datos_faltantes+=" fecha division ";
            console.log("falta fechas division");
          }else if(!this.unidad_principal){
            this.faltan_datos =true;
            this.datos_faltantes+=" unidad principal ";
            console.log("falta unidad principal");
          }else if(!this.operador_division[i]){
            this.faltan_datos =true;
            this.datos_faltantes+=" operador division ";
            console.log("falta operador division");
          }else if(!this.unidad_division[i]) {
            this.faltan_datos =true;
            this.datos_faltantes+=" unidad division ";
            console.log("falta unidad division");
          }else if(!this.divisiones[i].salida_exacta) {
            this.faltan_datos = true;
            this.datos_faltantes+=" datos de salida ";
            console.log("falta datos de salida");
          }else if(!this.divisiones[i].destino_exacto) {
            this.faltan_datos = true;
            this.datos_faltantes+=" datos de destino ";
            console.log("falta datos de destino");
          }
           data_divisiones.push({
                'nuevo':this.divisiones[i].nuevo,
                'id_dividido':this.divisiones[i].dividido,
                'id_viaje':id_viaje,
                'operador':this.operador_division[i].id, 
                'unidad':this.unidad_division[i].id,
                'fechaInicial':this.model[i].beginDate, 
                'fechaFinal':this.model[i].endDate,
                'lugar_salida':null,
                'hora_salida':null,
                'lugar_regreso':null,
                'hora_regreso':null,
                'tipo_division':this.tipos_division[i],
                'salida_exacta':this.quitarAmperson(this.divisiones[i].salida_exacta),
                'destino_exacto':this.quitarAmperson(this.divisiones[i].destino_exacto),
                'division_cancelada': this.divisiones[i].division_cancelada,
                'num_contrato':this.divisiones[i].num_contrato,
                'eliminar':this.divisiones[i].eliminar
              });

        }

      /*console.log("op-div",this.operador_division[i]);
      console.log("unid-div",this.unidad_division[i]);*/
      }   
      /*console.log("op-prin"+this.operador_principal);
      console.log("unid - princ"+this.unidad_principal);
      console.log(data_principal);
      console.log(data_divisiones);*/

     if(!this.faltan_datos) {
        this.crearDivision2(data_principal, data_divisiones);
      } 
  }
  crearDivision2(data_principal, data_divisiones){
    console.log(data_principal);
    console.log(data_divisiones);
    //agregar a base de datos
    //retornar divisiones activvas
    //quitar la cantidad de divisiones activas que habia
    //agregar la cantidad de divisiones que quedaron activas despues del ajuste


    let P1 = new Promise((resolve, reject)=>{
       this._operaciones.editarDivisiones(data_principal, data_divisiones).subscribe(
          response=>{
            //console.log(response);
            if(response.code==200) {
              if(this.viajes[this.dividiendo].iniciado==1) {
                resolve(response.dataIniciados);
              }else{
                resolve(response.data);
              }
              
            }else{
              reject(response);
            }
          },error=>{
            console.log(error);
            reject(error);
          });
    }).then((respuesta:any)=>{
        //console.log(respuesta);
        let eliminar = 0;
        let indice_padre = -1;
        console.log(this.viajes);
        console.log(this.divisiones);

        //Encontrar el indice donde comenzara a agregar o a eliminar
        for (var i = 0; i < this.viajes.length; i++) {
          let num = this.viajes[i].num_contrato.split('-');
          if(this.viajes[i].id == this.divisiones[0].id && indice_padre==-1  && num.length>4) {
            indice_padre = i;
          }
        }
        
        
        if(this.viajes[this.dividiendo].iniciado ==0) {
          eliminar = this.cantidad_divisiones_asignados;
        }else{
          eliminar = this.cantidad_divisiones_iniciados;
        }
          if(indice_padre==-1) {
            indice_padre = this.dividiendo+1;
          }
          console.log("eliminar : ",eliminar);
          for (var i = 0; i < eliminar; i++) {

              this.viajes.splice(indice_padre, 1);
              this.operador_sel.splice(indice_padre, 1);
              this.unidad_sel.splice(indice_padre, 1);
            }
            this.total_gral = this.total_gral-eliminar;

            for (var k =0 ; k < respuesta.length; k++) {
              this.viajes.splice(indice_padre,0,respuesta[k]);
              this.operador_sel.splice(indice_padre,0,{'id':respuesta[k].id_unidad,'nombre':respuesta[k].nombre_operador});
              this.unidad_sel.splice(indice_padre,0,{'id':respuesta[k].id_operador,'num_economico':respuesta[k].num_economico}); 
              this.total_gral++;
            }
            this.total_gral = this.total_gral-eliminar;
        
             
  //      console.log("eliminar : "+eliminar);
        console.log("asignados inicial ",this.cantidad_divisiones_asignados);
        console.log("iniciados inicial ",this.cantidad_divisiones_iniciados);
        console.log("indice_padre: "+indice_padre);
        console.log("Arreglo final",this.viajes);    

            
        this.emitirTotal(this.total_gral, this.viajes.length);

        swal.fire({
          position: 'center',
          type: 'success',
          title: 'Divisiones actualizadas con exito',
          showConfirmButton: false,
          timer: 2500
        })
        this.modalService.dismissAll();
        
    }).catch((reason:any)=>{
      console.log(reason);
    });
  }
  asignar_unidad_division(index){
    let select = this.unidad_division[index].id;
    //console.log(this.unidades[select]);
    let p = new Promise((resolve, reject)=>{
      this._filtrar.getOperador(select).subscribe(
      resp=>{
        //console.log(resp);
        if(resp.code==200) {
          this.operador_division[index]=resp.data;
          //console.log(this.operador_sel[index]);
        }else{
          
        }
        resolve(this.operador_sel[index]);
      },error=>{
        console.log(error);
        reject(error);
      });  
    });
  }
  asignar_unidad_principal(index){
    let select = this.unidad_principal.id;
    //console.log(this.unidades[select]);
    let p = new Promise((resolve, reject)=>{
      this._filtrar.getOperador(select).subscribe(
      resp=>{
        //console.log(resp);
        if(resp.code==200) {
          this.operador_principal=resp.data;
          //console.log(this.operador_sel[index]);
        }else{
          
        }
        resolve(this.operador_principal);
      },error=>{
        console.log(error);
        reject(error);
      });  
    });
  }
  cambiar_cantidad_divisiones(){
    if(this.tipo_division_sel=='ida_vuelta') {
      this.cantidad_divisiones=1;
    //}else if(this.tipo_division_sel=='dia'){  
    }else if(this.tipo_division_sel=='falla'){
      this.cantidad_divisiones=1;
    }else{
      this.cantidad_divisiones=0;
    }
      let fecha1 = new moment(this.viajes[this.dividiendo].fecha_salida,"YYYY-MM-DD");
      let fecha2 = new moment(this.viajes[this.dividiendo].fecha_regreso,"YYYY-MM-DD");
      //console.log(fecha1);
      //console.log(fecha2);
      this.cantidad_divisiones=fecha2.diff(fecha1, 'days');
      this.cantidad_divisiones_options=[];
      for (var i = 0; i <this.cantidad_divisiones; ++i) {
        this.cantidad_divisiones_options.push({'id_viaje':this.viajes[this.dividiendo].id,'division':(i+1)});
      }
    this.cambiarDivisiones();
  }
  cambiarDivisiones(){
    console.log(this.viajes[this.dividiendo]);
    this.unidad_division=[];
    this.operador_division=[];
    this.divisiones=[];
    //--------------------LIMITAR CALENDARIO
    //--------------------------------OBJETO DE CALENDARIO PRINCIPAL
    let temp_model =this.viajes[this.dividiendo].fecha_salida.split('-');
    this.model_principal={
      beginDate: { year:temp_model[0], month:temp_model[1]*1, day:temp_model[2]*1},
      endDate: {year:temp_model[0], month:temp_model[1]*1, day:temp_model[2]*1},
    }
    //--------------------------------LISTA DE OBJETOS DE CALENDARIOS DE DIVISIONES
     for (var i = 0; i < this.cantidad_divisiones; ++i) {
      this.divisiones.push({'id_viaje':this.viajes[this.dividiendo].id,'salida_exacta':'','destino_exacto':''});
      this.model.push({ 
          beginDate: { year:temp_model[0], month:temp_model[1]*1, day:temp_model[2]*1},
          endDate: {year:temp_model[0], month:temp_model[1]*1, day:temp_model[2]*1}
        });
    }
    this.cambiar_options_daterange();
    
  }
  validaDivisiones(){
    let data_divisiones = [];
    this.faltan_datos = false;
    let id_viaje = this.viajes[this.dividiendo].id;
    if(this.tipo_division_sel=='dia') {
      for (var i = 0; i < this.divisiones.length; ++i) {
           if(!this.operador_division[i]||!this.model[i]||!this.unidad_division[i]||!this.model_principal||!this.unidad_principal||!this.operador_principal||!this.divisiones[i].salida_exacta ||!this.divisiones[i].destino_exacto) {
             this.faltan_datos=true;
           }
           else{
             data_divisiones.push({
               'id_viaje':id_viaje,
               'operador':this.operador_division[i].id, 
               'unidad':this.unidad_division[i].id,
               'fechaInicial':this.model[i].beginDate, 
               'fechaFinal':this.model[i].endDate, 
               'salida_exacta':this.quitarAmperson(this.divisiones[i].salida_exacta),
               'destino_exacto':this.quitarAmperson(this.divisiones[i].destino_exacto),
             });
           }
         }   
    }else{
      if(!this.operador_principal||!this.unidad_principal||!this.operador_division[0]||!this.unidad_division[0]||!this.divisiones[0].salida_exacta||!this.divisiones[0].destino_exacto||!this.model[0]||!this.model_principal) {
             this.faltan_datos=true;
      }else{
         data_divisiones.push({
             'id_viaje':id_viaje,
             'operador':this.operador_division[0].id,
             'lugar_salida':null,
             'hora_salida':null,
             'lugar_regreso':null,
             'hora_regreso':null, 
             'unidad':this.unidad_division[0].id,
             'salida_exacta':this.quitarAmperson(this.divisiones[0].salida_exacta),
             'destino_exacto':this.quitarAmperson(this.divisiones[0].destino_exacto),
             'fechas':''});
       }
    }
    let data_principal ={'id_viaje':id_viaje, 'tipo_division':this.tipo_division_sel,'operador':this.operador_principal.id, 'unidad':this.unidad_principal.id, 'fechaInicial':this.model_principal.beginDate, 'fechaFinal':this.model_principal.endDate};
     if(!this.faltan_datos) {
        this.crearDivision(data_principal, data_divisiones);
      } 
  }
  crearDivision(data_principal, data_divisiones){
    let P1 = new Promise((resolve, reject)=>{
       this._operaciones.dividirViaje(data_principal, data_divisiones).subscribe(
          response=>{
            //console.log(response);
            if(response.code==200) {
              resolve(response.data);
            }else{
              reject(response);
            }
          },error=>{
            console.log(error);
            reject(error);
          });
    }).then((respuesta:any)=>{
        console.log(respuesta);
        //agregar respuesta al arreglo de datos a mostrar
        this.viajes[this.dividiendo].dividido = respuesta[0].dividido;
        if(this.viajes[this.dividiendo].iniciado == 0) {
 /*           for (var k =1 ; k <= respuesta.length; k++) {
            this.viajes.splice(this.dividiendo+k,respuesta[k-1]);
            this.operador_sel.splice(this.dividiendo+k,0,{'id':respuesta[k-1].id_unidad,'nombre':respuesta[k-1].nombre_operador});
            this.unidad_sel.splice(this.dividiendo+k,0,{'id':respuesta[k-1].id_operador,'num_economico':respuesta[k-1].num_economico}); 
            this.total_gral++;
          }
  */        
  //        this.emitirTotal(this.total_gral, this.viajes.length);
          for (var k =1 ; k <= respuesta.length; k++) {
            this.viajes.splice(this.dividiendo+k,0,respuesta[k-1]);
            this.operador_sel.splice(this.dividiendo+k,0,{'id':respuesta[k-1].id_unidad,'nombre':respuesta[k-1].nombre_operador});
            this.unidad_sel.splice(this.dividiendo+k,0,{'id':respuesta[k-1].id_operador,'num_economico':respuesta[k-1].num_economico}); 
            this.total_gral++;
          }
          this.viajes[this.dividiendo].dividido = respuesta[0].dividido;
          this.emitirTotal(this.total_gral, this.viajes.length);
        }
        
        swal.fire({
          position: 'center',
          type: 'success',
          title: 'Divisiones creadas con exito',
          showConfirmButton: false,
          timer: 2500
        })
        this.modalService.dismissAll();
        
    });
  }
  cambiar_options_daterange(){
    //-------------------SEPARAR FECHAS PARA LIMITAR CALENDARIO
    let temp = this.viajes[this.dividiendo].fecha_salida.split('-');
    let temp2 = this.viajes[this.dividiendo].fecha_regreso.split('-');
    temp = new moment([temp[0],temp[1]-1,temp[2]]).subtract(1,'d').format('YYYY-MM-DD');
    temp2 = new moment([temp2[0],temp2[1]-1,temp2[2]]).add(1,'d').format('YYYY-MM-DD');
    temp = (temp+"").split('-');
    temp2 = (temp2+"").split('-');
    this.limite_salida= temp;
    this.limite_regreso=temp2;
    //-------------------------------OPCIONES DEL CALENDARIO
    this.myDateRangePickerOptions= {
        dayLabels: { su: "Do", mo: "Lu", tu: "Ma", we: "Mi", th: "Ju", fr: "Vi", sa: "Sa" },
        monthLabels: { 1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic" },
        firstDayOfWeek: "mo",
        dateFormat: 'yyyy-mm-dd',
        width: '170px',
        editableDateRangeField:false,
        markCurrentDay:true,
        showClearBtn:false,
        disableUntil:{
          year:this.limite_salida[0], month:this.limite_salida[1], day:this.limite_salida[2]
        },
        disableSince:{
           year:this.limite_regreso[0], month:this.limite_regreso[1], day:this.limite_regreso[2]
        }
    };
  }
  quitarAmperson(cadena){
    if(cadena.lenght>0) {
      return cadena.replace(/&/g, '|amperson|');
    }else{
      return cadena;
    }
     
  }
  consultarMovimiento(index_model){
    //4046
    console.log(index_model);

  }
  onDateRangeChanged(event: any, index_movimiento) {
    let inicio = event.beginDate;
    let fin = event.endDate;
    let id  = this.viajes[this.dividiendo].id;
    let p = new Promise((encontrado, noEncontrado)=>{
      this._operaciones.getMovimiento(inicio, fin, id).subscribe(
        response=>{
          if(response.code==200) {
            encontrado(response.data);
          }else{
            noEncontrado(response.data);
          }
        },error=>{
          noEncontrado(error);
        });
    }).then((resolve:any)=>{
      this.divisiones[index_movimiento].salida_exacta = resolve;
    }).catch((reject:any)=>{
      console.log(reject);
    });
  }
  cambiarDatosSalida(){
    console.log(this.viajes[this.dividiendo]);
    console.log(this.divisiones);
    if(this.checkSalida) {
      let salida = this.viajes[this.dividiendo].salida_exacta;
      let hora = this.viajes[this.dividiendo].hora_salida;
      let salida_exacta = "";
      if(hora.length>0&&salida.length>0) {
        salida_exacta = salida+" a las "+hora;
      }else if(salida.length>0){
        salida_exacta = salida;
      }
      for (var i = 0; i < this.divisiones.length; ++i) {
         this.divisiones[i].salida_exacta = salida_exacta;
      }
      
    }else{
      for (var i = 0; i < this.divisiones.length; ++i) {
         this.divisiones[i].salida_exacta = null;
      }
    }
  }
//---------------iniciar viaje
  iniciarViaje(index){
    console.log(this.viajes[index]);
    let p = new Promise((resolve, reject)=>{
      this._operaciones.iniciarViaje(this.viajes[index].id, this.viajes[index].num_contrato).subscribe(
        resp=>{
            resolve(resp);
        },error=>{
          reject(error);
        });
    }).then((respuesta:any)=>{
      console.log(respuesta);
      this.viajes.splice(index, 1);
      swal.fire({
          position: 'center',
          type: 'success',
          title: 'Divisiones creadas con exito',
          html:respuesta.message
        })
    
     let tipo_unidad = "";
      switch (this.viajes[index].unidad) {
        case "S VIP 19":
          tipo_unidad = 'Sprinter VIP para 19 pasajeros';
        break;
        case "S VIP 16":
          tipo_unidad = 'Sprinter VIP para 16 pasajeros';
        break;
        case "S TUR 19":
          tipo_unidad = 'Sprinter Turismo para 19 pasajeros';
        break;
        case "S TUR 16":
          tipo_unidad = 'Sprinter Turismo para 16 pasajeros';
        break;
        case "S TUR 20":
          tipo_unidad = 'Sprinter Turismo para 20 pasajeros';
        break;
        case "TOYOTA 12":
          tipo_unidad = 'Toyota Hiace para 12 pasajeros';
        break;
        case "VERSA 4":
          tipo_unidad = 'Versa para 4 pasajeros';
        break;
        case "SUBURBAN 6":
          tipo_unidad = 'Suburban para 6 pasajeros';
        break;
        default:
          // code...
        break;
      }
      /*let message_whats = `https://api.whatsapp.com/send?phone=521`+respuesta.operador.celular.replace(/-/g, '').replace(/ /g, '')+`
                            &text=*GDLvan NUEVO VIAJE* `+respuesta.operador.nombre+` `+respuesta.operador.apellidos+
                            ` este es tú próximo *CONTRATO: `+respuesta.viaje.num_contrato+`* con salida el día *`+moment(respuesta.viaje.fecha_salida, 'YYYY-MM-DD').format('DD/MM/YYYY')+
                            `* a las *`+moment(respuesta.viaje.hora_salida, 'HH:mm').format('hh:mm A')+`* , 
                            Del domicilio *`+this.viajes[index].salida_exacta+`* hacia *`+this.viajes[index].destino_exacto+
                            `* con fecha de regreso el día *`+moment(this.viajes[index].fecha_regreso, 'YYYY-MM-DD').format('DD/MM/YYYY')+`* a las *`+moment(this.viajes[index].hora_regreso, 'HH:mm').format('hh:mm A')+
                            `* El Cliente es *`+this.viajes[index].nombre_cliente+
                            `*, con Cel *`+this.viajes[index].cel.replace(/-/g, '').replace(/ /g, '')+
                            `* en la unidad *`+this.unidad_sel[index].num_economico+
                            `* con placas *`+this.unidad_sel[index].placas+
                            `* Recuerda presentarte en el taller por lo menos 3 horas antes de la Salida programada de tu viaje. NO OLVIDES, `+
                            `*1.-* Contactar al Cliente, *2.-* Tu uniforme completo, *3.-* Lavar tu Unidad y Revisarla Mecánicamente antes de salir.`;
      window.open(message_whats, '_blank');
      message_whats = `https://api.whatsapp.com/send?phone=521`+this.viajes[index].cel.replace(/-/g, '').replace(/ /g, '')+
                    `&text=*GDLvan - Tú Próximo Viaje*, CONTRATO: *`+this.viajes[index].num_contrato+
                    `* Confirmamos su salida para el día *`+moment(this.viajes[index].fecha_salida, 'YYYY-MM-DD').format('DD/MM/YYYY')+
                    `* a las *`+moment(this.viajes[index].hora_salida, 'HH:mm').format('hh:mm A')+
                    `* del domicilio *`+this.viajes[index].salida_exacta+`* su operador será, *`+this.viajes[index].operador.nombre+` `+this.viajes[index].operador.apellidos+`* con teléfono, *`+this.viajes[index].operador.tel1.replace(/-/g, '').replace(/ /g, '')+
                    `* su unidad es un(a) *`+this.viajes[index].unidad+`* con placas *`+this.viajes[index].placas_unidad+
                    `*. Quedamos a su disposición para cualquier aclaración. En caso que desee hacer algún cambio, puede comunicarse al Centro de Atención al 01 (33) 3880-1680`;
      window.open(message_whats, '_blank');

*/
    }).catch((error)=>{
      console.log(error);
    });
    /*this._operaciones.iniciarViaje(contrato.id).subscribe(
      (res:any) => {
        if(res.success){
          swal('Exito', 'Viaje iniciado correctamente', 'success');
          contrato.iniciado = 1;
          this.contratos_asignados.splice(i, 1);
          this.contratos_curso.push(contrato);
        }
        else{
          swal('Error', 'No se pudo iniciar el viaje', 'error');
        }
      },
      (err:any) => {
        swal('Error', 'No se pudo iniciar el viaje', 'error');
        console.log(err);
      }
    );
  */}
}

