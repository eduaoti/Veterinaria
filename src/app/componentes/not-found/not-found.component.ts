import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  images = [
    { id: 1, isCat: false, imageUrl: '/app/assets/1.png', animationClass: '' },
    { id: 2, isCat: false, imageUrl: '/app/assets/Toro.png', animationClass: '' },
    { id: 3, isCat: false, imageUrl: '/app/assets/3.png', animationClass: '' },
    { id: 4, isCat: false, imageUrl: '/app/assets/Pajaro.png', animationClass: '' },
    { id: 5, isCat: false, imageUrl: '/app/assets/Logo.png', animationClass: '' },
    { id: 6, isCat: false, imageUrl: '/app/assets/3.png', animationClass: '' },
    { id: 7, isCat: false, imageUrl: '/app/assets/Pez.png', animationClass: '' },
    { id: 8, isCat: true, imageUrl: '/app/assets/2.png', animationClass: '' } // Gato
  ];

  constructor(private router: Router) {
    this.assignAnimations();
  }

  // Baraja un array aleatoriamente (algoritmo Fisher-Yates)
  shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Asigna animaciones asegurando que todas sean únicas
  assignAnimations() {
    let animationClasses = ['move1', 'move2', 'move3', 'move4', 'move5', 'move6', 'move7', 'moveCat'];

    // Si hay más imágenes que animaciones, repetimos aleatoriamente pero con barajado
    while (animationClasses.length < this.images.length) {
      animationClasses = animationClasses.concat(animationClasses);
    }
    
    animationClasses = this.shuffleArray(animationClasses).slice(0, this.images.length);

    this.images.forEach((img, index) => {
      img.animationClass = animationClasses[index];
    });
  }

  checkImage(isCat: boolean): void {
    if (isCat) {
      this.router.navigate(['/principio']);
    } else {
      alert('Ese no es el gato, tonto');
    }
  }
}
