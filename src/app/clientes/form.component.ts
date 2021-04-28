import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router,ActivatedRoute } from '@angular/router';
import  swal  from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public titulo: string = "Crear cliente";
  public errores: String[];
  public regiones: Region[];

  constructor(
    private clienteService:ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones = regiones;
    });
  }

  public create(): void{
    this.clienteService.create(this.cliente).subscribe(
      response => {
        this.router.navigate(['/clientes']);
        swal.fire('Cliente guardado',response.mensaje,'success');
      },
      err => {
        this.errores = err.error.errors as String[];
      }
    );
  }

  private cargarCliente():void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.clienteService.getCliente(id).subscribe(response => this.cliente = response);
      }
    });
  }

  public actualizarCliente():void{
    this.clienteService.update(this.cliente).subscribe(cliente => {
      this.cliente = cliente;
      this.router.navigate(['/clientes']);
      swal.fire('Cliente Actualizado',`El cliente ${cliente.nombre} ha sido actualizado con exito`,'success');
    });
  }

  public compararRegion(oCli: Region,oLoop: Region){
    return ((oLoop === null || oLoop === undefined) || (oCli === null || oCli === undefined)) ? false : oLoop.id == oCli.id;
  }


}
