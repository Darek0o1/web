import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  updateDoc,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  DocumentReference,
  CollectionReference
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private firestore: Firestore) {}

  private get usuariosRef(): CollectionReference {
    return collection(this.firestore, 'usuarios') as CollectionReference;
  }

  obtenerUsuarioPorUid(uid: string): Observable<any> {
    const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
    return docData(usuarioRef, { idField: 'uid' });
  }

  obtenerUsuarios(): Observable<any[]> {
    return collectionData(this.usuariosRef, { idField: 'id' });
  }

  agregarUsuario(usuario: any): Promise<DocumentReference> {
    return addDoc(this.usuariosRef, usuario);
  }

  actualizarUsuario(uid: string, datos: any): Promise<void> {
    const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
    return updateDoc(usuarioRef, datos);
  }

  eliminarUsuario(uid: string): Promise<void> {
    const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
    return deleteDoc(usuarioRef);
  }
}
