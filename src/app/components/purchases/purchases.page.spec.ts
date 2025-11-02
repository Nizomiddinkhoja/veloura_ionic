import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchasesPage } from './purchases.page';

describe('PurchasesPage', () => {
  let component: PurchasesPage;
  let fixture: ComponentFixture<PurchasesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
