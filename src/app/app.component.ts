import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { employee } from '../models/employee';
import { AuthService } from './auth.service';
import { ImageService } from './image.service';
import { ChatbotComponent } from './chatbot/chatbot.component';

declare var bootstrap: any; // Allow Bootstrap modal usage in TypeScript

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, FormsModule, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [AuthService]
})
export class AppComponent implements OnInit {
  employee: employee = {
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: ''
  };

  message = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private service: ImageService
  ) {}

  ngOnInit(): void {}

  requestdemo(): void {
    console.log('Request Demo Clicked');
    console.log('User:', this.auth.currentuser);

    if (!this.auth.currentuser) {
      console.log('User not logged in, redirecting to login');
      this.router.navigate(['/login']);
    } else {
      console.log('User logged in, navigating to mainimage');
      this.router.navigate(['/mainimage']);
    }
  }

  submit(): void {
    this.service.addEmployee(this.employee).subscribe({
      next: (response) => {
        console.log('✅ Employee saved successfully:', response);
        this.message = 'Signed up successfully!';
        this.closeModal();
        this.router.navigate(['/mainimage']);
      },
      error: (error) => {
        if (error.status === 409) {
          this.message = ' Email already exists!';
        } else {
          this.message = ' Failed to register. Please try again.';
        }
        console.error(' Error saving employee:', error);
      }
    });
  
    console.log(this.employee);
  }
  

  closeModal(): void {
    const modalElement = document.getElementById('signupModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();
    }
  }
}
