import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, CollectionReference } from '@angular/fire/firestore';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';

interface Documento {
  id?: string;
  codigo: string;
  url: string;
  fecha: string;
  fechaEnvio: string;
  estado: 'Aprobado' | 'Rechazado' | 'Pendiente' | 'Sin revisar';
  asunto?: string;
  descripcion?: string;
  tipoTramite?: string;
  archivos?: any;
}

@Component({
  selector: 'app-documentos',
  standalone: true,
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss'],
  imports: [CommonModule, SafeUrlPipe]
})
export class DocumentosComponent implements OnInit {
  private firestore = inject(Firestore);
  private sanitizer = inject(DomSanitizer);

  documentos: Documento[] = [];
  modalAbierto = false;
  documentoSeleccionado: Documento | null = null;

  ngOnInit(): void {
    this.obtenerDocumentos();
  }

  obtenerDocumentos(): void {
    const tramitesRef = collection(this.firestore, 'tramites') as CollectionReference<Documento>;
    collectionData(tramitesRef, { idField: 'id' }).subscribe((docs) => {
      this.documentos = docs;
    });
  }

  verDocumento(doc: Documento): void {
    this.documentoSeleccionado = doc;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.documentoSeleccionado = null;
  }

  descargarDocumento(doc: Documento): void {
    if (!doc.url) return;

    const link = document.createElement('a');
    link.href = doc.url;
    link.download = `${doc.descripcion || 'documento'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  cambiarEstado(estado: Documento['estado']): void {
    if (this.documentoSeleccionado) {
      this.documentoSeleccionado.estado = estado;

      const docIndex = this.documentos.findIndex(d => d.codigo === this.documentoSeleccionado?.codigo);
      if (docIndex !== -1) {
        this.documentos[docIndex].estado = estado;
      }
    }
  }

  getEstadoClass(estado?: Documento['estado']): string {
    switch (estado) {
      case 'Aprobado': return 'estado-aprobado';
      case 'Rechazado': return 'estado-rechazado';
      case 'Pendiente': return 'estado-pendiente';
      case 'Sin revisar': return 'estado-sin-revisar';
      default: return 'estado-desconocido';
    }
  }

  getEstadoIcon(estado?: Documento['estado']): string {
    switch (estado) {
      case 'Aprobado': return 'fa-check-circle estado-aprobado';
      case 'Rechazado': return 'fa-times-circle estado-rechazado';
      case 'Pendiente': return 'fa-clock estado-pendiente';
      case 'Sin revisar': return 'fa-question-circle estado-sin-revisar';
      default: return 'fa-question estado-desconocido';
    }
  }
  getSafeUrl(url?: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url || '');
}
}
