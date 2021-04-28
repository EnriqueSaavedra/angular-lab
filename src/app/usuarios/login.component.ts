import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  public titulo = "Login";
  public usuario: Usuario;


  constructor(private authService: AuthService,
              private router: Router) {

    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      this.router.navigate(['/clientes']);
    }
  }

  login():void{
    if(this.usuario.clave == null || this.usuario.username == null){
       Swal.fire('Faltan datos','Debe ingresar un usuario y clave','warning');
       return;
    }
    this.authService.login(this.usuario).subscribe( response => {
      let usuario = this.authService.usuario;
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarTokenUsuario(response.access_token);

      this.router.navigate(['/clientes']);
      Swal.fire('Bienvenido','Usuario '+usuario.nombre+' autenticado','success');
    }, error => {
      if(error.status == 400){
        Swal.fire('Error Login','usuario o clave incorrecta.','error');
      }
    });
  }


}
