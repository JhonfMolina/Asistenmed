import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TiposDocumentosService } from 'src/app/administracion-centro/service/tipos-documentos.service';
import { AuthService } from 'src/app/client/auth/service/auth.service';
import { TipoDocumento } from 'src/app/models/parametros/tipo-documento.model';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-orden-medica',
  templateUrl: './orden-medica.component.html',
  styleUrls: ['./orden-medica.component.scss']
})

export class OrdenMedicaComponent implements OnInit{

  public tipoDocumento: String = "";
  public tipoOrdenMedica: TipoDocumento | any;

  public centrosMedicos: Array<any> = [];
  public listadoTiposDocumentos: Array<any> = [];

  public subscription: Subscription[] = [];
  public CENTRO_MEDICO = this._auth.getCookieCentroMedico();
  
  constructor(
    public _tiposDocumentosService: TiposDocumentosService,
    public _mensaje: NotificationService,
    public _auth: AuthService,
  ) {}
  
  ngOnInit(): void { this.inicializador() }

  setTipoOrdenMedica(tipo: String){

    if (this.listadoTiposDocumentos.length){
      
      let tipoDocumento = this.listadoTiposDocumentos.find(
        (documento) => documento.slug.includes(tipo) 
      )
      
      if (tipoDocumento){
        this.tipoOrdenMedica = new TipoDocumento(
          this.CENTRO_MEDICO.id,
          tipoDocumento.nombre,
          tipoDocumento.consecutivo,
          tipoDocumento.estado,
          tipoDocumento.id,
          tipoDocumento.slug,
        )
   
        this.tipoDocumento = tipo
      }
    }
  }

  inicializador() {
    setTimeout( () => { this.getListadoTiposDocumentos() }, 0);
  }

  getListadoTiposDocumentos() {
    this.subscription.push(this._tiposDocumentosService.getListadoTipoDocumentos(this.CENTRO_MEDICO.id,[1]).subscribe((resp) => {
      this.listadoTiposDocumentos = resp.data;
    }))
  }

}
