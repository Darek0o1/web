import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-const-tablets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './const-tablets.component.html',
  styleUrls: ['./const-tablets.component.scss'],
})
export class ConstTabletsComponent {
  constanciaForm: FormGroup;
  noAdeudoForm: FormGroup;

  ticketGenerado: boolean = false;
  datosTicket: any = {};

  constanciaNoAdeudoGenerada: boolean = false;
  datosNoAdeudo: any = {};

  constructor(private fb: FormBuilder, private firestore: Firestore) {
    this.constanciaForm = this.fb.group({
      nombre: ['', Validators.required],
      grado: ['', Validators.required],
      seccion: ['', Validators.required],
      fecha: ['', Validators.required],
      codigo: ['', Validators.required],
      cargador: ['', Validators.required],
      pantalla: ['', Validators.required],
      carcasa: ['', Validators.required],
      funciona: ['', Validators.required],
      bateria: ['', Validators.required],
      observaciones: ['']
    });

    this.noAdeudoForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      grado: ['', Validators.required],
      seccion: ['', Validators.required],
    });
  }

  async generarConstancia() {
    if (this.constanciaForm.invalid) return;

    const formData = this.constanciaForm.value;

    try {
      const entregasRef = collection(this.firestore, 'entregas_tablets');
      await addDoc(entregasRef, {
        nombre: formData.nombre,
        grado: formData.grado,
        seccion: formData.seccion,
        fechaEntrega: formData.fecha,
        codigoTablet: formData.codigo,
        cargador: formData.cargador,
        pantalla: formData.pantalla,
        carcasa: formData.carcasa,
        funciona: formData.funciona,
        bateria: formData.bateria,
        observaciones: formData.observaciones
      });

      this.ticketGenerado = true;
      this.datosTicket = {
        ...formData
      };
    } catch (error) {
      console.error("Error al guardar constancia:", error);
    }
  }

  async sacarConstancia() {
    if (this.noAdeudoForm.invalid) return;

    const formData = this.noAdeudoForm.value;

    try {
      // Cambié el nombre de la colección a la correcta
      const noAdeudoRef = collection(this.firestore, 'constancias_no_adeudo_tablets');
      await addDoc(noAdeudoRef, {
        nombreCompleto: formData.nombreCompleto,
        grado: formData.grado,
        seccion: formData.seccion,
        fechaGeneracion: Timestamp.now()
      });

      this.constanciaNoAdeudoGenerada = true;
      this.datosNoAdeudo = {
        ...formData,
        fechaGeneracion: new Date()
      };
    } catch (error) {
      console.error("Error al guardar constancia de no adeudo:", error);
    }
  }

  generarPDF(elementId: string, nombreArchivo: string) {
    const elemento = document.getElementById(elementId);
    if (!elemento) return;

    html2canvas(elemento).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${nombreArchivo}.pdf`);
    });
  }
}
