import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentuser?:user;
  constructor(private route:Router) { }
  login(email:user){
    this.currentuser=email;
    console.log(this.currentuser);
     this.route.navigate(['']);
  }
  
}
interface user{
  email:string;
}
