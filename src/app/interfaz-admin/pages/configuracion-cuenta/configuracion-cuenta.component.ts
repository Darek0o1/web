import { Component, OnInit, inject } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-configuracion-cuenta',
  templateUrl: './configuracion-cuenta.component.html',
  styleUrls: ['./configuracion-cuenta.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ConfiguracionCuentaComponent implements OnInit {
  private auth: Auth = inject(Auth);
  uid: string = '';
  usuario: any = {
    nombre: '',
    apellido: '',
    correo: '',
    numero: '',
    fechaNacimiento: ''
  };
  datosOriginales: any = {};
  cargando: boolean = true;
  guardando: boolean = false;
  error: string | null = null;
  editando: string | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.uid = currentUser.uid;
      this.obtenerUsuario();
    } else {
      this.error = 'Usuario no autenticado.';
      this.cargando = false;
    }
  }

  obtenerUsuario(): void {
    this.cargando = true;
    this.error = null;
    this.usuarioService.obtenerUsuarioPorUid(this.uid).subscribe({
      next: (data) => {
        this.usuario = { ...data };
        this.datosOriginales = { ...data };
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar los datos del usuario.';
        this.cargando = false;
      },
    });
  }

  toggleEdit(campo: string): void {
    this.editando = this.editando === campo ? null : campo;
  }

  cancelarEdicion(): void {
    if (this.editando) {
      this.usuario[this.editando] = this.datosOriginales[this.editando];
    }
    this.editando = null;
  }

  async guardarCambios(campo: string): Promise<void> {
    if (!this.usuario || !this.editando) return;

    this.guardando = true;
    this.error = null;

    try {
      const nuevoValor = this.usuario[campo];
      await this.usuarioService.actualizarUsuario(this.uid, { [campo]: nuevoValor });

      this.datosOriginales[campo] = nuevoValor;
      this.editando = null;
    } catch (err) {
      console.error(err);
      this.error = 'Error al guardar los cambios.';
      this.usuario[campo] = this.datosOriginales[campo];
    } finally {
      this.guardando = false;
    }
  }

  formatearFecha(fecha: any): string {
    if (!fecha) return 'No especificado';
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Formato inválido';
    }
  }
  getLabel(campo: string): string {
  const labels: {[key: string]: string} = {
    'nombre': 'Nombre',
    'apellido': 'Apellido',
    'numero': 'Teléfono',
    'fechaNacimiento': 'Fecha de nacimiento'
  };
  return labels[campo] || campo;
}

getInputType(campo: string): string {
  return campo === 'fechaNacimiento' ? 'date' : 
         campo === 'numero' ? 'tel' : 'text';
}
}