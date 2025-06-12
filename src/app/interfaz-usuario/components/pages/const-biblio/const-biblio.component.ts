import { Component, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-const-biblio',
  standalone: true,
  templateUrl: './const-biblio.component.html',
  styleUrls: ['./const-biblio.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class ConstBiblioComponent {
  grados = [1, 2, 3, 4, 5, 6];
  secciones = ['A', 'B', 'C', 'D', 'E'];

  private firestore = inject(Firestore);
  private fb = inject(FormBuilder);

  prestamoForm: FormGroup;
  constanciaForm: FormGroup;
  searchTerm: string = '';
  resultados: any[] = [];

  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | 'info' | '' = '';

  constructor() {
    this.prestamoForm = this.fb.group({
      nombreAlumno: ['', Validators.required],
      grado: ['', Validators.required],
      seccion: ['', Validators.required],
      fechaPrestamo: ['', Validators.required],
      fechaDevolucion: ['', Validators.required],
      tituloLibro: ['', Validators.required],
      codigoLibro: ['', Validators.required],
    });

    this.constanciaForm = this.fb.group({
      nombreAlumno: ['', Validators.required],
      grado: ['', Validators.required],
      seccion: ['', Validators.required],
      motivo: ['', Validators.required],
    });
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'info') {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;

    setTimeout(() => {
      this.mensaje = '';
      this.tipoMensaje = '';
    }, 5000);
  }

  async registrarPrestamo() {
    if (this.prestamoForm.invalid) {
      this.mostrarMensaje('❌ Por favor, completa todos los campos del préstamo.', 'error');
      return;
    }

    try {
      const formData = this.prestamoForm.value;
      const prestamosRef = collection(this.firestore, 'prestamos_biblioteca');
      await addDoc(prestamosRef, formData);
      this.mostrarMensaje('✅ Préstamo registrado correctamente.', 'success');
      this.prestamoForm.reset();
    } catch (error) {
      console.error(error);
      this.mostrarMensaje('❌ Error al registrar el préstamo.', 'error');
    }
  }

  async solicitarConstancia() {
    if (this.constanciaForm.invalid) {
      this.mostrarMensaje('❌ Por favor, completa todos los campos de la constancia.', 'error');
      return;
    }

    try {
      const formData = this.constanciaForm.value;
      const constanciasRef = collection(this.firestore, 'constancias_no_adeudo');
      await addDoc(constanciasRef, {
        ...formData,
        fecha: new Date().toISOString(),
      });
      this.mostrarMensaje('✅ Solicitud de constancia enviada.', 'success');
      this.constanciaForm.reset();
    } catch (error) {
      console.error(error);
      this.mostrarMensaje('❌ Error al enviar la constancia.', 'error');
    }
  }

  async buscarDeudas() {
    this.resultados = [];

    if (!this.searchTerm.trim()) {
      this.mostrarMensaje('⚠️ Ingresa el nombre del alumno para buscar.', 'info');
      return;
    }

    try {
      const q = query(
        collection(this.firestore, 'prestamos_biblioteca'),
        where('nombreAlumno', '==', this.searchTerm.trim())
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const fechaDevolucion = new Date(data['fechaDevolucion']);
        const hoy = new Date();
        const estado = hoy > fechaDevolucion ? 'Atrasado' : 'Devuelto';
        this.resultados.push({ ...data, estado });
      });

      if (this.resultados.length === 0) {
        this.mostrarMensaje('ℹ️ No se encontraron registros de préstamos.', 'info');
      }
    } catch (error) {
      console.error(error);
      this.mostrarMensaje('❌ Error al buscar deudas.', 'error');
    }
  }

  devolverLibro(item: any) {
    this.mostrarMensaje(`📚 Libro "${item.tituloLibro}" marcado como devuelto.`, 'success');
  }
}
