import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainimageComponent } from './mainimage.component';

describe('MainimageComponent', () => {
  let component: MainimageComponent;
  let fixture: ComponentFixture<MainimageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainimageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
