import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import 'ag-grid-enterprise';

describe('AppComponent', () => {
  let fixture;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AgGridModule.withComponents([]),
        HttpClientModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('the grid header cells should be as expected', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const { columnDefs } = fixture.componentInstance;
      expect(columnDefs.length).toBe(4);
      expect(columnDefs[0].headerName).toBe('');
      expect(columnDefs[1].headerName).toBe('Published on');
      expect(columnDefs[2].headerName).toBe('Video Title');
      expect(columnDefs[3].headerName).toBe('Description');
    });
  });

  it('the number of data lines should correspond to the expected amount of data from the request', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    const { rowData } = fixture.componentInstance;
    expect(rowData.length).toBe(50);
  }));

  it('objects dataRows items should be as expected', fakeAsync(() => {
    const data = {
      description: 'Music video by Lil Wayne performing John. (C) 2011 Cash Money Records Inc.',
      publishedAt: '13/05/2011',
      thumbnails: 'https://i.ytimg.com/vi/3fumBcKC6RE/default.jpg',
      title: 'Lil Wayne - John (Explicit) ft. Rick Ross',
      videoId: '3fumBcKC6RE',
    };

    fixture.detectChanges();
    tick(1000);
    const { rowData } = fixture.componentInstance;
    expect(rowData[0]).toEqual(data);
  }));

  it('selected all items should be as count total items', fakeAsync(() => {
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.ag-icon-menu').click();
    fixture.nativeElement.querySelector('.ag-menu-option').click();
    fixture.nativeElement.querySelector('.ag-input-wrapper').click();
    tick(1000);
    const { totalItems, selectedItems } = fixture.componentInstance;
    expect(selectedItems).toBe(totalItems);
  }));

});
