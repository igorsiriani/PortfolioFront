import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddPortfolioPage } from './add-portfolio.page';

describe('AddPortfolioPage', () => {
  let component: AddPortfolioPage;
  let fixture: ComponentFixture<AddPortfolioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPortfolioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPortfolioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
