import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ImageService } from '../image.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  emailExists: boolean = false;
  message: string = '';

  constructor(private fb: FormBuilder,
    private route:Router,private authservice:AuthService,private service:ImageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };
      
      
  
      this.service.login(credentials).subscribe({
        next: (response) => {
          console.log('✅ Login successful:', response);
          this.authservice.login({ email: this.loginForm.get('email')?.value }); 
          this.route.navigate(['/mainimage']);
        },
        error: (error) => {
          this.message = 'Invalid email or password.';
          
        }
      });
    }
  }
  
  
}
