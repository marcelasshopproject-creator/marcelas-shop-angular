import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListItem } from './product-list-item';

describe('ProductListItem', () => {
  let component: ProductListItem;
  let fixture: ComponentFixture<ProductListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
