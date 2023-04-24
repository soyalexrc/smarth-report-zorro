import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketStateComponent } from './ticket-state.component';

describe('TicketStateComponent', () => {
  let component: TicketStateComponent;
  let fixture: ComponentFixture<TicketStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
