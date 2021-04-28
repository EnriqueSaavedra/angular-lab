import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  titulo = 'Curso Angular Spring';

  constructor(public authService: AuthService,
              private router: Router){

  }

  public logout(): void {
    this.authService.logout();
    Swal.fire('Sesión terminada', 'Se ha cerrado la sesión con éxito','success');
    this.router.navigate(['/login']);
  }

}
