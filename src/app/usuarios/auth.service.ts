import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

    public get usuario(): Usuario{
      if(this._usuario != null){
        return this._usuario;
      }else if(this._usuario == null && sessionStorage.getItem('usuario')){
        this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
        return this._usuario;
      }
      return new Usuario();
    }

    public get token(): string{
      if(this._token != null){
        return this._token;
      }else if(this._token == null && sessionStorage.getItem('token')){
        this._token = sessionStorage.getItem('token');
        return this._token;
      }
      return null;
    }

  login(usuario: Usuario):Observable<any>{
    const urlEndpoint: string = 'http://localhost:8080/oauth/token';
    const credenciales: string = btoa('angularapp:12345');
    const httpHeaders = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization':'Basic '+credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username',usuario.username);
    params.set('password',usuario.clave);
    console.log(params.toString()); //importante el toString casi fundamental

    return this.http.post(urlEndpoint, params.toString(), {headers:httpHeaders});
  }

  guardarUsuario(accessToken: string): void{
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.username = payload.user_name;
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));

  }

  guardarTokenUsuario(accessToken: string): void{
      this._token = accessToken;
      sessionStorage.setItem('token',accessToken);
  }

  obtenerDatosToken(accessToken: string):any{
    if(accessToken != null){
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

  isAuthenticated():boolean{
    let payload = this.obtenerDatosToken(this.token);
    return (payload != null && payload.user_name && payload.user_name.length > 0);
  }

  logout():void{
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    //sessionStorage.removeItem('token');
    //sessionStorage.removeItem('usuario');
  }

  hasRole(role:string):boolean{
    if(this.usuario.roles.includes(role)){ //valida si el elemento existe
      return true;
    }
    return false;
  }
}
