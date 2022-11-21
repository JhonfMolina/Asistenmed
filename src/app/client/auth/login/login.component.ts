import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public hide: boolean = true;
  public formulario: FormGroup;
  constructor(
    public _formBuilder: UntypedFormBuilder,
    public _iniciarSesionService: AuthService,
    public _mensaje: NotificationService,
    public _router: Router
    ) {
      this.formulario = this._formBuilder.group({
        email:["", [Validators.required, Validators.email]],
        password:["", Validators.required],
        terminos:[false],
      })
     }

  ngOnInit(): void {
    
  }

  formControl = ()=> this.formulario.controls;

  iniciarSesion() {
    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();
    if (this.formulario.valid) {  
      if (!this.formControl()['terminos'].value) {
       return this._mensaje.mensajeInfo('Debe aceptar los terminos para continuar.');
      }      
      this._iniciarSesionService.loginUsuario(this.formControl()['email'].value, this.formControl()['password'].value).subscribe(resp => {
        this._router.navigate(['/administracion-centro']);
      })
    } else {
      this._mensaje.mensajeError(this._mensaje.verificarForm);
    }
    
  }


}
