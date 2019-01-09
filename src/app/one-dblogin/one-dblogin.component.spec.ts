import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneDBLoginComponent } from './one-dblogin.component';

describe('OneDBLoginComponent', () => {
  let component: OneDBLoginComponent;
  let fixture: ComponentFixture<OneDBLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneDBLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneDBLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
