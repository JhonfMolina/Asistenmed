import { Component, OnInit } from '@angular/core';
import { RouteService } from './services/route.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public routeService: RouteService) {

  }
  ngOnInit(): void {
    this.routeService.initRouteConfig();
  }
}
