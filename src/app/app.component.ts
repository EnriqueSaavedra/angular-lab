import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Bienvenido a angular';
  curso: string = 'Curso spring 5 angular 7';
  profesor: string = 'Andrés Guzman';

}
