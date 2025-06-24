import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-cliente-inicio',
  templateUrl: './cliente-inicio.component.html',
  styleUrls: ['./cliente-inicio.component.css'],
})
export class ClienteInicioComponent implements OnInit {
  likes: { [key: string]: number } = {};
  comentarios: { [key: string]: string[] } = {};
  secciones = ['hospitalizacion', 'espera', 'revision', 'quirofano', 'estetica', 'guarderia', 'laboratorio'];

  ngOnInit(): void {
    this.secciones.forEach(seccion => {
      const likeGuardado = localStorage.getItem(`like_${seccion}`);
      const comentariosGuardados = localStorage.getItem(`comentarios_${seccion}`);
      this.likes[seccion] = likeGuardado ? parseInt(likeGuardado) : 0;
      this.comentarios[seccion] = comentariosGuardados ? JSON.parse(comentariosGuardados) : [];
    });
  }

  darLike(area: string): void {
    this.likes[area]++;
    localStorage.setItem(`like_${area}`, this.likes[area].toString());
  }

  agregarComentario(area: string, texto: string): void {
    if (texto.trim()) {
      this.comentarios[area].push(texto.trim());
      localStorage.setItem(`comentarios_${area}`, JSON.stringify(this.comentarios[area]));
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToBottom(): void {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const scrollBottomBtn = document.getElementById('scrollBottomBtn');

    if (window.scrollY > 100) {
      scrollTopBtn?.classList.add('show');
      scrollBottomBtn?.classList.add('show');
    } else {
      scrollTopBtn?.classList.remove('show');
      scrollBottomBtn?.classList.remove('show');
    }
  }
}
