import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Documento {
  codigo: string;
  titulo: string;
  usuario: string;
  fecha: string;
  estado: string;
}

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  totalDocumentos = 0;
  aprobados = 0;
  pendientes = 0;
  rechazados = 0;

  estadoSeleccionado: string = 'Todos los Estados';

  documentos: Documento[] = [
    { codigo: 'DOC-003', titulo: 'Informe Anual', usuario: 'Carlos Sánchez', fecha: '02/03/2025', estado: 'pendiente' },
    { codigo: 'DOC-004', titulo: 'Acta de Reunión', usuario: 'Ana Torres', fecha: '01/03/2025', estado: 'aprobado' },
    { codigo: 'DOC-005', titulo: 'Plan de Trabajo', usuario: 'Luis Gutiérrez', fecha: '28/02/2025', estado: 'rechazado' },
    { codigo: 'DOC-006', titulo: 'Informe de Progreso', usuario: 'Marta Gómez', fecha: '15/03/2025', estado: 'pendiente' },
    { codigo: 'DOC-007', titulo: 'Propuesta de Proyecto', usuario: 'Javier Pérez', fecha: '10/03/2025', estado: 'aprobado' },
    { codigo: 'DOC-008', titulo: 'Resumen Ejecutivo', usuario: 'Lucía Martínez', fecha: '20/03/2025', estado: 'rechazado' },
    { codigo: 'DOC-009', titulo: 'Estudio de Mercado', usuario: 'José Ruiz', fecha: '25/03/2025', estado: 'pendiente' },
    { codigo: 'DOC-010', titulo: 'Informe de Investigación', usuario: 'Laura Sánchez', fecha: '27/03/2025', estado: 'aprobado' },
  ];

  documentosFiltrados: Documento[] = [];

  constructor() {
    this.calcularEstadisticas();
    this.documentosFiltrados = this.documentos;
  }

  calcularEstadisticas() {
    this.totalDocumentos = this.documentos.length;
    this.aprobados = this.documentos.filter(doc => doc.estado === 'aprobado').length;
    this.pendientes = this.documentos.filter(doc => doc.estado === 'pendiente').length;
    this.rechazados = this.documentos.filter(doc => doc.estado === 'rechazado').length;
  }

  filtrarDocumentos() {
    if (this.estadoSeleccionado === 'Todos los Estados') {
      this.documentosFiltrados = this.documentos;
    } else {
      this.documentosFiltrados = this.documentos.filter(
        doc => doc.estado === this.estadoSeleccionado.toLowerCase()
      );
    }
  }
}
