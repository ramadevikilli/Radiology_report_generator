import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from '../image.service';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {
  imageId: string = '';
  imageUrl: string | null = null;
  reportText: string = '';
  selectedModel: string = '';
  selectedFile: File | null = null;
  scanType: string = '';
  bodyPart: string = '';
  prediction: string = '';
  reportData: string = '';

  diseaseDetails: any = {
    "bone fracture": {
        "description": "A break in the bone due to trauma or stress.",
        "symptoms": "Swelling, pain, inability to move the limb.",
        "recommendations": "• Immobilize the area\n• See a doctor for casting/surgery\n• Avoid pressure on the fracture",
        "precautions": "• Avoid putting pressure on the fractured area\n• Keep the area immobilized as prescribed by your doctor",
        "causes": "Caused by a traumatic injury or excessive stress on the bone.",
        "diagnosis": "X-ray is typically used to confirm a fracture.",
        "treatment": "Rest, casting, or surgery depending on the severity of the fracture.",
        "prognosis": "With proper treatment, most fractures heal completely.",
        "prevention": "• Wear protective gear when engaging in high-risk activities\n• Avoid excessive force or impact on bones"
    },
    "glioma": {
        "description": "A tumor that forms in the glial cells of the brain.",
        "symptoms": "Headache, nausea, vomiting, seizures, blurred vision.",
        "recommendations": "MRI, neurosurgical consultation. May require surgery, radiation, or chemotherapy.",
        "precautions": "• Early detection with regular checkups\n• Avoid stress and maintain a healthy lifestyle",
        "causes": "Genetic mutations or exposure to radiation can contribute to the development of gliomas.",
        "diagnosis": "MRI and biopsy are used to diagnose gliomas.",
        "treatment": "Surgical removal of the tumor, followed by radiation or chemotherapy.",
        "prognosis": "Varies depending on the tumor grade and location. Early treatment improves outcomes.",
        "prevention": "• Limit exposure to radiation\n• Maintain a healthy lifestyle"
    },"meningioma": {
        "description": "A tumor that originates in the meninges, the layers of tissue covering the brain and spinal cord.",
        "symptoms": "Headache, dizziness, nausea, visual disturbances.",
        "recommendations": "Monitor or surgically remove if symptomatic.",
        "precautions": "• Regular MRI scans for monitoring\n• Consult with a neurosurgeon",
        "causes": "Genetic mutations or family history can increase the risk of developing meningiomas.",
        "diagnosis": "MRI or CT scans are used to detect meningiomas.",
        "treatment": "Surgical removal or radiation therapy, depending on the size and location of the tumor.",
        "prognosis": "Most meningiomas are benign and have a good prognosis after treatment.",
        "prevention": "• No known specific prevention, but regular check-ups can help with early detection."
    },
    "pituitary tumor": {
        "description": "A tumor that affects hormone production in the pituitary gland.",
        "symptoms": "Headaches, vision problems, abnormal growth or development.",
        "recommendations": "MRI, blood tests, and consultation with an endocrinologist.",
        "precautions": "• Regular checkups to monitor hormone levels\n• Be mindful of hormonal changes in the body",
        "causes": "Genetic mutations, prolonged hormonal imbalances.",
        "diagnosis": "MRI scans are the primary method for detecting pituitary tumors.",
        "treatment": "Surgical removal or radiation therapy, depending on the tumor size.",
        "prognosis": "Most cases are treatable, especially with early detection.",
        "prevention": "• No specific prevention known, but early detection helps reduce risks."
    },
    "osteoporosis": {
        "description": "A condition where bones become fragile and porous.",
        "symptoms": "Back pain, height loss, easy bone fractures.",
        "recommendations": "Calcium and Vitamin D supplements, weight-bearing exercises, bisphosphonates.",
        "precautions": "• Avoid smoking\n• Maintain a healthy diet and weight\n• Avoid excessive alcohol consumption",
        "causes": "Age, lack of calcium, sedentary lifestyle, genetics.",
        "diagnosis": "Bone density test (DEXA scan).",
        "treatment": "Medications like bisphosphonates, hormone replacement therapy, exercise.",
        "prognosis": "If untreated, osteoporosis can lead to fractures and other complications.",
        "prevention": "• Weight-bearing exercise\n• Adequate calcium intake\n• Avoid smoking"
    },"osteopenia": {
        "description": "Lower than normal bone mineral density, often a precursor to osteoporosis.",
        "symptoms": "Generally no symptoms until bone fractures occur.",
        "recommendations": "Diet rich in calcium and Vitamin D, weight-bearing exercises.",
        "precautions": "• Limit alcohol and caffeine\n• Quit smoking",
        "causes": "Aging, genetics, insufficient nutrition, and lack of physical activity.",
        "diagnosis": "Bone mineral density (BMD) test.",
        "treatment": "Lifestyle changes, supplements, sometimes medications.",
        "prognosis": "With proper lifestyle changes, osteoporosis may be prevented.",
        "prevention": "• Regular exercise\n• Sufficient calcium and Vitamin D intake"
    },
    "tuberculosis": {
        "description": "An infectious disease that primarily affects the lungs.",
        "symptoms": "Cough, weight loss, night sweats, fever.",
        "recommendations": "X-ray and sputum tests, anti-TB medication, isolation during early treatment.",
        "precautions": "• Isolate during treatment\n• Follow medication regimen strictly",
        "causes": "Bacterial infection caused by Mycobacterium tuberculosis.",
        "diagnosis": "Sputum culture, X-ray, tuberculin skin test.",
        "treatment": "Antibiotics for 6-12 months.",
        "prognosis": "With proper treatment, TB is curable, but may relapse if treatment is not followed.",
        "prevention": "• BCG vaccination\n• Good hygiene and ventilation"
    },
    "pneumonia": {
        "description": "An infection of the lungs that causes inflammation.",
        "symptoms": "Cough, fever, chest pain, difficulty breathing.",
        "recommendations": "Rest, hydration, antibiotics (if bacterial), hospitalization if severe.",
        "precautions": "• Avoid smoking\n• Get vaccinated (e.g., flu, pneumococcal vaccines)",
        "causes": "Bacterial, viral, or fungal infections.",
        "diagnosis": "Chest X-ray, blood tests, sputum culture.",
        "treatment": "Antibiotics, rest, and in some cases, hospitalization.",
        "prognosis": "With prompt treatment, most cases recover fully.",
        "prevention": "• Vaccination\n• Good hygiene (handwashing)"
    },
    "alzheimer's disease": {
        "description": "A progressive neurodegenerative disease that affects memory and cognitive functions.",
        "symptoms": "Memory loss, confusion, difficulty completing familiar tasks.",
        "recommendations": "Cognitive therapy, medication for memory support, and caregiver support.",
        "precautions": "• Keep the brain active with puzzles, reading, etc.\n• Regular checkups with a neurologist",
        "causes": "Genetic mutations, aging, and environmental factors.",
        "diagnosis": "Neuroimaging, cognitive tests, and family history assessment.",
        "treatment": "Medications like donepezil, cognitive therapies.",
        "prognosis": "Progresses over time, but memory loss can be slowed with treatment.",
        "prevention": "• Cognitive activities\n• Healthy diet (e.g., Mediterranean diet)"
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.imageId = this.route.snapshot.paramMap.get('id') || '';
  }

  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];

      if (this.selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
          this.reportText = '';
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        alert('Please select a valid image file.');
      }
    }
  }

  clearImage(): void {
    this.imageUrl = null;
    this.selectedFile = null;
    this.reportText = '';
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  submitImage(): void {
    if (!this.selectedFile) {
      alert('Please select an image before submitting.');
      return;
    }

    this.reportText = 'Generating report... Please wait.';

    this.imageService.uploadImage(this.selectedFile).subscribe(
      (response) => {
        this.scanType = response.scan_type;
        this.bodyPart = response.body_part;
        this.prediction = response.disease;

        const details = this.diseaseDetails[this.prediction.toLowerCase()] || {};

        this.reportText = ` Diagnostic Report
--------------------------
Scan Type : ${this.scanType}
Body Part : ${this.bodyPart}
Disease   : ${this.prediction}

Description: ${details.description || 'Not available'}
Symptoms: ${details.symptoms || 'Not available'}
Recommendations: ${details.recommendations || 'Not available'}
Precautions: ${details.precautions || 'Not available'}
Causes: ${details.causes || 'Not available'}
Diagnosis: ${details.diagnosis || 'Not available'}
Treatment: ${details.treatment || 'Not available'}
Prognosis: ${details.prognosis || 'Not available'}
Prevention: ${details.prevention || 'Not available'}
`;

        this.reportData = this.reportText;
      },
      (error) => {
        console.error('Error uploading image:', error);
        this.reportText = 'Error generating report.';
      }
    );
  }

  downloadReport(): void {
    if (!this.imageUrl) {
      alert('No image to include in report.');
      return;
    }

    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text('Radiology Diagnostic Report', margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text(`Report ID: RAD-${Math.floor(1000 + Math.random() * 9000)}`, margin, y);
    doc.text(`Date: ${new Date().toLocaleDateString()}  Time: ${new Date().toLocaleTimeString()}`, 130, y);
    y += 10;

    doc.setLineWidth(0.5);
    doc.line(margin, y, 190, y);
    y += 10;

    const imgWidth = 70;
    const imgHeight = 70;
    doc.addImage(this.imageUrl, 'JPEG', margin, y, imgWidth, imgHeight);

    doc.setTextColor(0);
    doc.setFontSize(12);
    const textStartX = margin + imgWidth + 10;

    doc.text(`Scan Type: ${this.scanType || 'N/A'}`, textStartX, y + 10);
    doc.text(`Body Part: ${this.bodyPart || 'N/A'}`, textStartX, y + 20);
    doc.text(`Disease: ${this.prediction || 'N/A'}`, textStartX, y + 30);

    y += imgHeight + 20;

    const details = this.diseaseDetails[this.prediction.toLowerCase()] || {};

    doc.setFontSize(14);
    doc.setTextColor(30, 144, 255);
    doc.text('Clinical Details:', margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setTextColor(50);
    doc.setFont("times", "normal");

    const reportDetails = `
Based on the analysis of the provided image, the model predicts the presence of ${this.prediction || 'an unknown condition'} in the ${this.bodyPart || 'unspecified body part'} scan. 

Symptoms: ${details.symptoms || 'N/A'}
Recommendations: ${details.recommendations || 'N/A'}
Precautions: ${details.precautions || 'N/A'}
Causes: ${details.causes || 'N/A'}
Diagnosis: ${details.diagnosis || 'N/A'}
Treatment: ${details.treatment || 'N/A'}
Prognosis: ${details.prognosis || 'N/A'}
Prevention: ${details.prevention || 'N/A'}
Please consult a radiologist for clinical confirmation and next steps.
`;


    const splitText = doc.splitTextToSize(reportDetails, 170);
    doc.text(splitText, margin, y);
    y += splitText.length * 7 + 10;

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.setFont("times", "italic");
    doc.text('Disclaimer: This report is system-generated and must be reviewed by a licensed radiologist.', margin, y);

    doc.save('radiology_diagnostic_report.pdf');
  }

  goBack() {
    this.router.navigate(['/mainimage']);
  }
}
