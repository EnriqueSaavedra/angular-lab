import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { Cliente } from './cliente';
import { Observable,throwError } from 'rxjs';
import { HttpClient,HttpEvent,HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';



@Injectable(  )
export class ClienteService {

  private httpHeaders:HttpHeaders = new HttpHeaders({'Content-type':'application/json'});
  private urlEndpoint:string = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) { }

  private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization',`Bearer ${token}`);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e):boolean{
    if(e.status == 401 || e.status == 403){
      this.router.navigate(['/login']);
      return true;
    }
    return false;
  }

  getClientes(page: number): Observable<any>{
    //return of(CLIENTES);
    //return this.http.get<Cliente[]>(this.urlEndpoint);
    console.log(page);
    return this.http.get(`${this.urlEndpoint}/page/${page}`,{headers:this.agregarAuthorizationHeader()}).pipe(
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
    return this.http.post<any>(this.urlEndpoint,cliente,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        if(e.status == 400){
          return throwError(e);
        }
        swal.fire('Error al crear',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  getCliente(id:number):Observable<any>{
    return this.http.get<any>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        this.router.navigate(['/clientes']);
        swal.fire('Error al editar',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente):Observable<Cliente>{
    return this.http.put(`${this.urlEndpoint}/${cliente.id}`,cliente,{headers:this.agregarAuthorizationHeader()}).pipe(
      map( (response:any) => response.cliente as Cliente),
      catchError(e => {
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        swal.fire('Error al Editar',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }


  delete(id: number):Observable<any>{
    return this.http.delete<any>(`${this.urlEndpoint}/${id}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        swal.fire('Error al eliminar',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }


  subirFoto(archivo: File,id: any):Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append('archivo',archivo);
    formData.append('id',id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if(token != null){
      httpHeaders = httpHeaders.append('token',`Bearer ${token}`);
    }

    const req = new HttpRequest('POST', `${this.urlEndpoint}/upload`,formData, {
      reportProgress: true,
      headers: httpHeaders
    });
    return this.http.request(req).pipe(
      catchError(e => {
          this.isNoAutorizado(e);
          return throwError(e);
      })
    );
  }

  getRegiones():Observable<Region[]>{
    return this.http.get<Region[]>(`${this.urlEndpoint}/regiones`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
}
