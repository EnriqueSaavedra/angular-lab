import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Cliente } from './cliente';
import { Observable,throwError } from 'rxjs';
import { HttpClient,HttpEvent, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';



@Injectable(  )
export class ClienteService {

  private urlEndpoint:string = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) { }
  /* Ahora se maneja con interceptor
  private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization',`Bearer ${token}`);
    }
    return this.httpHeaders;
  }
  */

  getClientes(page: number): Observable<any>{
    //return of(CLIENTES);
    //return this.http.get<Cliente[]>(this.urlEndpoint);
    console.log(page);
    return this.http.get(`${this.urlEndpoint}/page/${page}`).pipe(
      tap((response: any) => {
        //el map ya cambió el valor de response a Cliente[]
        (response.content as Cliente[]).forEach(
          cliente => {
            console.log(cliente.nombre);
          }
        ),
      map((response: any ) => {
        (response.content as Cliente[]).map(cliente => {
          let datePine = new DatePipe('en-US');
          cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.apellido = cliente.apellido.toUpperCase();
          //cliente.createAt = datePine.transform(cliente.createAt,'dd/MM/yyyy');
          //cliente.createAt = formatDate(cliente.createAt,'dd/MM/yyyy','en-US');
          return cliente;
        });
        return response;
      })
      }),
    );
  }

  create(cliente: Cliente):Observable<any>{
    return this.http.post<any>(this.urlEndpoint,cliente).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getCliente(id:number):Observable<any>{
    return this.http.get<any>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if(e.status == 401){
          this.router.navigate(['/clientes']);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje)
        }
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente):Observable<Cliente>{
    return this.http.put(`${this.urlEndpoint}/${cliente.id}`,cliente).pipe(
      map( (response:any) => response.cliente as Cliente),
      catchError(e => {
        if(e.error.mensaje){
          console.error(e.error.mensaje)
        }
        return throwError(e);
      })
    );
  }


  delete(id: number):Observable<any>{
    return this.http.delete<any>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if(e.error.mensaje){
          console.error(e.error.mensaje)
        }
        return throwError(e);
      })
    );
  }


  subirFoto(archivo: File,id: any):Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append('archivo',archivo);
    formData.append('id',id);
    const req = new HttpRequest('POST', `${this.urlEndpoint}/upload`,formData, {
      reportProgress: true
    });
    return this.http.request(req);
  }

  getRegiones():Observable<Region[]>{
    return this.http.get<Region[]>(`${this.urlEndpoint}/regiones` ).pipe(
      catchError(e=>{
        if(e.error.mensaje){
          console.error(e.error.mensaje)
        }
        return throwError(e);
      })
    );
  }
}
