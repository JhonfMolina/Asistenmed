import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public verificarForm: string = "Verificar los datos del formulario."


  constructor() { }

  public mensajeSuccess(msj:string){
    this.Toast.fire({icon: "success", title: msj})
  }

  public mensajeError(msj:string){
    this.Toast.fire({icon: "error", title: msj})
  }

  public mensajeInfo(msj:string){
    this.Toast.fire({icon: "info", title: msj})
  }

  private Toast = Swal.mixin({
    toast: true,
    position: 'bottom-start',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    width:'35rem',
    padding:'0 3px',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__zoomOut'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  
  
}