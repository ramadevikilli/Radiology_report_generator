import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../image.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-mainimage',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './mainimage.component.html',
  styleUrl: './mainimage.component.css'
})
export class MainimageComponent {
  images = [
    { 
        id: 'img1', 
        url: 'images/AI.png', 
        name: 'X-Ray/CTScan', 
        description: ' Helps diagnose  diseases such as Tuberculosis, Pneumonia, and other conditions.'
    },
];

  constructor(private router: Router, private imageService: ImageService) {}

  navigateToImage(imageId: string) {
   
    this.router.navigate(['/image', imageId]);
  }
}
