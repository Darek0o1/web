import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tramites',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './tramites.component.html',
  styleUrls: ['./tramites.component.scss'],
})
export class TramitesComponent {
  tramiteForm: FormGroup;
  archivosSeleccionados: File[] = [];
  dragOver = false;

  mensajeToast: string = '';
  tipoToast: 'success' | 'danger' | 'warning' | 'info' = 'success';

  ticketGenerado: string = '';
  codigoGenerado: string = '';

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore
  ) {
    this.tramiteForm = this.fb.group({
      tipoTramite: ['', Validators.required],
      asunto: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;

    if (event.dataTransfer?.files) {
      this.onFilesAdded(Array.from(event.dataTransfer.files));
    }
  }

  onFilesAdded(files: File[]) {
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        this.mostrarToast(`El archivo ${file.name} excede 5MB.`, 'danger');
        return;
      }
      if (file.type !== 'application/pdf') {
        this.mostrarToast(`El archivo ${file.name} no tiene un formato permitido.`, 'warning');
        return;
      }
      this.archivosSeleccionados.push(file);
    });
  }

  onFileSelected(event: any) {
    const archivos: FileList = event.target.files;
    this.onFilesAdded(Array.from(archivos));
  }

  eliminarArchivo(index: number) {
    this.archivosSeleccionados.splice(index, 1);
  }

  async onSubmit() {
    if (this.tramiteForm.invalid) {
      this.mostrarToast('Complete todos los campos obligatorios.', 'warning');
      return;
    }

    if (this.archivosSeleccionados.length === 0) {
      this.mostrarToast('Debe adjuntar al menos un documento.', 'warning');
      return;
    }

    try {
      const { tipoTramite, asunto, descripcion } = this.tramiteForm.value;
      const archivosBase64: string[] = [];

      for (const archivo of this.archivosSeleccionados) {
        const base64 = await this.convertFileToBase64(archivo);
        archivosBase64.push(base64 as string);
      }

      const ticket = this.generarTicket();
      const codigo = await this.generarCodigoTramite();

      const docRef = await addDoc(collection(this.firestore, 'tramites'), {
        tipoTramite,
        asunto,
        descripcion,
        archivos: archivosBase64,
        fechaEnvio: new Date(),
        ticket,
        codigo
      });

      this.ticketGenerado = ticket;
      this.codigoGenerado = codigo;

      this.mostrarToast('¡Trámite enviado correctamente!', 'success');
      this.tramiteForm.reset();
      this.archivosSeleccionados = [];
    } catch (error) {
      console.error('Error al enviar trámite:', error);
      this.mostrarToast('Ocurrió un error al enviar el trámite.', 'danger');
    }
  }

  async generarCodigoTramite(): Promise<string> {
    const snapshot = await getDocs(collection(this.firestore, 'tramites'));
    const total = snapshot.size + 1;
    return `DOC-${total.toString().padStart(3, '0')}`;
  }

  convertFileToBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  generarTicket(): string {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minuto = String(fecha.getMinutes()).padStart(2, '0');
    const segundo = String(fecha.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `TK-${anio}${mes}${dia}-${hora}${minuto}${segundo}-${random}`;
  }

  descargarTicket() {
    const contenido = `
      COMPROBANTE DE TRÁMITE

      Ticket: ${this.ticketGenerado}
      Código del documento: ${this.codigoGenerado}
      Fecha de emisión: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Ticket_${this.ticketGenerado}.txt`;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'danger' | 'warning' | 'info') {
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    setTimeout(() => this.cerrarToast(), 5000);
  }

  cerrarToast() {
    this.mensajeToast = '';
  }
}
