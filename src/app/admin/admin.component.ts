import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ProgressBarService } from '../services/progress-bar.service';
import { Router } from '@angular/router';
import { AuthService } from '../client/auth/service/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

    CENTRO_MEDICO = this._auth.getCookieCentroMedico();

  constructor(
    private breakpointObserver: BreakpointObserver,
    public _progressBar: ProgressBarService,
    public _router: Router,
    public _auth: AuthService
  ) {
        
  }
  cerrarSesion() {
    this._auth.deleteAuthorizationToken();
    this._auth.deleteCookieCentroMedico();
    this._router.navigate(['/']);
  }
}
