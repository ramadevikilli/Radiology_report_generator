import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://127.0.0.1:5003/api/predict'; // Flask API URL
   

  constructor(private http: HttpClient) {}

  
  // employee.service.ts
   addEmployee(employee: any) {
         return this.http.post('http://localhost:5001/api/employees', employee);
   }
   login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post('http://localhost:5001/api/login', credentials);
  }

  
  
  // Upload Image to Flask API for Prediction
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  return this.http.post<any>(this.apiUrl, formData);
   
  }
}
