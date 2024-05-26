import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyTipPage } from './daily-tip.page';

describe('DailyTipPage', () => {
  let component: DailyTipPage;
  let fixture: ComponentFixture<DailyTipPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
