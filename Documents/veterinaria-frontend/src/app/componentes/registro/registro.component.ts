import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  petForm: FormGroup;
  speciesList = ['Perro', 'Gato', 'Ave', 'Reptil'];
  breedList = ['Labrador', 'Persa', 'Canario', 'Iguana'];  // Ejemplo
  foodQualityList = ['Muy buena', 'Regular', 'Mala'];

  constructor(private fb: FormBuilder) {
    this.petForm = this.fb.group({
      petId: [{value: '001', disabled: true}],  // ID no editable
      fileNumber: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      gender: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0)]],
      entryDate: ['', Validators.required],
      allergies: [''],
      foodQuality: ['', Validators.required],
      foodObservations: [''],
      observations: ['']
    });
  }

  onSubmit() {
    if (this.petForm.valid) {
      console.log(this.petForm.value);
      alert('Registro de Mascota Exitoso!');
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }
}
