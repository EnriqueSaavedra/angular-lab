import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input()
  public cliente: Cliente;
  public titulo: string = 'Detalle cliente';
  public imagenSeleccionada: File;
  public progreso: number = 0;


  constructor(private clienteService: ClienteService,
              public modalService: ModalService) { }

  ngOnInit(): void {
  }

  public seleccionarFoto(event: any){
    this.imagenSeleccionada = event.target.files[0];
    this.progreso = 0;
    if(this.imagenSeleccionada.type.indexOf('image') < 0){
      swal.fire('Error','Debe seleccionar un archivo de tipo imagen','error');
      this.imagenSeleccionada = null;
    }
  }

  public subirFoto(){
    if(!this.imagenSeleccionada){
      swal.fire('Error','Debe seleccionar una imagen.','error');
      return;
    }
    this.clienteService.subirFoto(this.imagenSeleccionada,this.cliente.id).subscribe(event => {
        //this.cliente = cliente;
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round( (event.loaded/event.total) *100 );
        }else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          this.modalService.notificarUpload.emit(this.cliente);
          swal.fire('Exito!',response.mensaje,'success');
        }
    });
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.imagenSeleccionada = null;
    this.progreso = 0;
  }



}
