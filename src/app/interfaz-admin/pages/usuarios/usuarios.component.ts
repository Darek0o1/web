import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.services';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  busqueda: string = '';
  usuarioSeleccionado: any = null;
  mostrarModalEditar: boolean = false;
  mostrarModalEliminar: boolean = false;
  modalConfirmacion: boolean = false;

  mensajeError: string = '';

  nuevoUsuario = {
    nombre: '',
    correo: '',
    contrasena: '',
    confirmar: '',
    rol: 'Usuario'
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  buscarUsuarios() {
    return this.usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  abrirModalEditar(usuario: any) {
    this.usuarioSeleccionado = { ...usuario };
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar() {
    this.usuarioSeleccionado = null;
    this.mostrarModalEditar = false;
  }

  guardarCambiosUsuario() {
    this.mensajeError = '';
    if (this.usuarioSeleccionado && this.usuarioSeleccionado.id) {
      // Validación correo @gmail.com al editar
      if (!this.usuarioSeleccionado.correo.toLowerCase().endsWith('@gmail.com')) {
        this.mostrarError('⚠️ El correo debe ser de dominio @gmail.com.');
        return;
      }

      this.usuarioService.actualizarUsuario(this.usuarioSeleccionado.id, {
        nombre: this.usuarioSeleccionado.nombre,
        correo: this.usuarioSeleccionado.correo,
        contrasena: this.usuarioSeleccionado.contrasena,
        rol: this.usuarioSeleccionado.rol
      }).then(() => {
        this.cerrarModalEditar();
      }).catch(error => {
        console.error(error);
        this.mostrarError('🚫 Error al guardar los cambios del usuario.');
      });
    }
  }

  abrirModalEliminar(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar() {
    this.usuarioSeleccionado = null;
    this.mostrarModalEliminar = false;
  }

  confirmarEliminacion() {
    this.mensajeError = '';
    if (this.usuarioSeleccionado && this.usuarioSeleccionado.id) {
      this.usuarioService.eliminarUsuario(this.usuarioSeleccionado.id).then(() => {
        this.cerrarModalEliminar();
      }).catch(error => {
        console.error(error);
        this.mostrarError('⚠️ No se pudo eliminar el usuario. Intenta nuevamente.');
      });
    }
  }

  agregarUsuario() {
    this.mensajeError = '';
    if (
      this.nuevoUsuario.nombre &&
      this.nuevoUsuario.correo &&
      this.nuevoUsuario.contrasena &&
      this.nuevoUsuario.confirmar
    ) {
      // Validar que el correo termine en @gmail.com
      if (!this.nuevoUsuario.correo.toLowerCase().endsWith('@gmail.com')) {
        this.mostrarError('⚠️ El correo debe ser de dominio @gmail.com.');
        return;
      }

      if (this.nuevoUsuario.contrasena !== this.nuevoUsuario.confirmar) {
        this.mostrarError('⚠️ Las contraseñas no coinciden.');
        return;
      }

      const nuevo = {
        nombre: this.nuevoUsuario.nombre,
        correo: this.nuevoUsuario.correo,
        contrasena: this.nuevoUsuario.contrasena,
        rol: this.nuevoUsuario.rol
      };

      this.usuarioService.agregarUsuario(nuevo).then(() => {
        this.modalConfirmacion = true;
        this.nuevoUsuario = {
          nombre: '',
          correo: '',
          contrasena: '',
          confirmar: '',
          rol: 'Usuario'
        };
        this.mensajeError = '';
      }).catch(error => {
        console.error(error);
        this.mostrarError('🚫 Error al agregar el usuario. Verifica los permisos o intenta más tarde.');
      });

    } else {
      this.mostrarError('❗ Todos los campos son obligatorios.');
    }
  }

  cerrarModalConfirmacion() {
    this.modalConfirmacion = false;
  }

  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.mensajeError = '';
    }, 5000);
  }
}
