import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, User, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private currentUserRole = new BehaviorSubject<string | null>(null);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    onAuthStateChanged(this.auth, async (user) => {
      this.currentUser = user;
      if (user) {
        const role = await this.getUserRole(user.uid);
        this.currentUserRole.next(role);
      } else {
        this.currentUserRole.next(null);
      }
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
      const role = await this.getUserRole(uid);
      this.currentUserRole.next(role);

      if (role === 'admin') {
        this.router.navigate(['/admin/panel']);
      } else if (role === 'usuario') {
        this.router.navigate(['/user/panel-user']);
      } else {
        console.warn('Rol desconocido');
      }

    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async getUserRole(uid: string): Promise<string | null> {
    try {
      const docRef = doc(this.firestore, `users/${uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data()['role'] || null;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo rol:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getRole(): Observable<string | null> {
    return this.currentUserRole.asObservable();
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUser = null;
    this.currentUserRole.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
