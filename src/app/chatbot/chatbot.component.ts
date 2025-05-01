import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  messages: { text: string, sender: 'user' | 'bot' }[] = [];
  userInput: string = '';
  isChatVisible: boolean = false;
  userName: string = '';
  additionalSymptoms: string[] = [];
  step: string = 'start';

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  startConversation() {
    this.http.get<any>('http://127.0.0.1:5000/start_conversation').subscribe(res => {
      this.messages.push({ text: res.message, sender: 'bot' });
      this.step = 'getName';
    });
  }

  sendName() {
    this.http.post<any>('http://127.0.0.1:5000/get_symptoms', { name: this.userName }).subscribe(res => {
      this.messages.push({ text: res.message, sender: 'bot' });

      this.step = 'confirmSymptom';
    });
  }

  confirmSymptom(symptom: string) {
    this.http.post<any>('http://127.0.0.1:5000/confirm_symptom', { symptom }).subscribe(res => {
      this.messages.push({ text: res.message, sender: 'bot' });
      this.additionalSymptoms.push(symptom);
      this.step = 'confirmDays';
    });
  }

  confirmDays(days: number) {
    this.http.post<any>('http://127.0.0.1:5000/confirm_days', { days }).subscribe(res => {
      this.messages.push({ text: res.message, sender: 'bot' });
      this.step = 'finalPrediction';
    });
  }

 submitPrediction() {
  // Remove duplicates
  const uniqueSymptoms = [...new Set(this.additionalSymptoms)];

  this.http.post<any>('http://127.0.0.1:5000/final_prediction', {
    additional_symptoms: uniqueSymptoms
  }).subscribe(res => {
    this.messages.push({ text: `You may have: ${res.predicted_disease}`, sender: 'bot' });
    this.messages.push({ text: `Description: ${res.description}`, sender: 'bot' });
    this.messages.push({ text: `Precautions: ${res.precautions.join(', ')}`, sender: 'bot' });
    this.messages.push({ text: `Advice: ${res.advice}`, sender: 'bot' });
    this.step = 'done';
  });
}

  final_step() {
  this.messages.push({ text: 'Thank you for using the chatbot. Stay healthy! 💬', sender: 'bot' });
  this.step='end';
}



  sendMessage() {
    const input = this.userInput.trim();
    if (!input) return;

    this.messages.push({ text: input, sender: 'user' });

    switch (this.step) {
      case 'start':
        this.startConversation();
        break;
      case 'getName':
        this.userName = input;
        this.sendName();
        break;
      case 'confirmSymptom':
        this.confirmSymptom(input);
        break;
      case 'confirmDays':
        const days = parseInt(input);
        if (!isNaN(days)) this.confirmDays(days);
        break;
      case 'finalPrediction':
        this.submitPrediction();
        break;
      case 'done':
      this.final_step();
      break;
      
      
    }

    this.userInput = '';
  }
}
