import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputsViewComponent } from './outputs-view.component';

describe('OutputsViewComponent', () => {
  let component: OutputsViewComponent;
  let fixture: ComponentFixture<OutputsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutputsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
