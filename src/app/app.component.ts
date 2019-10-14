import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private gridApi;
  private gridColumnApi;

  rowData: any;
  components: any;
  isCheckShow: any = false;
  totalItems: any = 0;
  selectedItems: any = 0;

  columnDefs = [
    {
      headerName: '',
      field: 'thumbnails',
      cellRenderer: 'thumbnailsImageRender',
      checkboxSelection: this.isCheckShow,
      headerCheckboxSelection: this.isCheckShow,
      menuTabs: ['generalMenuTab'],
      resizable: true,
      width: 180,
    },
    {
      headerName: 'Published on',
      field: 'publishedAt',
      menuTabs: [],
      resizable: true,
      cellClass: 'publishedAt-col'
    },
    {
      headerName: 'Video Title',
      field: 'title',
      cellRenderer: 'titleLinksRenderer',
      menuTabs: [],
      resizable: true,
      minWidth: 100,
      width: 500,
      maxWidth: 500,
      cellClass: 'title-col'
    },
    {
      headerName: 'Description',
      field: 'description',
      menuTabs: [],
      resizable: true,
      minWidth: 100,
      width: 500,
      maxWidth: 500,
      cellClass: 'description-col'
    }
  ];

  constructor(private http: HttpClient) {
    this.components = {
      titleLinksRenderer: this.titleLinksRenderer,
      thumbnailsImageRender: this.thumbnailsImageRender,
    };
  }

  titleLinksRenderer(params: any) {
    if (params.value === undefined || params.value === null) {
      return '';
    } else {
      const {videoId, title} = params.data;
      return `<a href='https://www.youtube.com/watch?v=${videoId}' target="_blank">${title}</a>`;
    }
  }

  thumbnailsImageRender(params: any) {
    if (params.value === undefined || params.value === null) {
      return '';
    } else {
      const {thumbnails} = params.data;
      return `<img src='${thumbnails}'>`;
    }
  }

  formatDate(data) {
    const date = new Date(data);
    const day = date.getDate().toString().length === 1 ? `0${date.getDate()}` : date.getDate();
    const month = (date.getMonth() + 1).toString().length === 1 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    return `${day}/${month}/${date.getFullYear()}`;
  }

  onGridReady = (params: any) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const data = this.http.get('https://www.googleapis.com/youtube/v3/search?key=AIzaSyDOfT_BO81aEZScosfTYMruJobmpjqNeEk&maxResults=' +
      '50&type=video&part=snippet&q=john');

    data.subscribe((res: any) => {
      this.totalItems = res.items.length;
      this.rowData = res.items.map(item => {
        const {title, publishedAt, description, thumbnails} = item.snippet;
        return {
          videoId: item.id.videoId,
          title,
          thumbnails: thumbnails.default.url,
          publishedAt: this.formatDate(publishedAt),
          description,
        };
      });
    });
  }

  onSelectionChanged = (params: any) => {
    this.selectedItems = params.api.getSelectedRows().length;
  }

  getContextMenuItems(params: any) {
    if (params.column.colId === 'title') {
      return [
        {
          name: 'Open in new tab',
          action: () => {
            window.open(`https://www.youtube.com/watch?v=${params.node.data.videoId}`, '_blank');
          }
        },
        'copy',
        'paste',
        'copyWithHeaders',
      ];
    }
    return [];
  }

  getMainMenuItems = () => {
    return [
      {
        name: this.isCheckShow ? 'Hide' : 'Show',
        action: () => {
          this.isCheckShow = !this.isCheckShow;
          this.columnDefs[0].checkboxSelection = this.isCheckShow;
          this.columnDefs[0].headerCheckboxSelection = this.isCheckShow;
          this.gridApi.setColumnDefs(this.columnDefs);
        }
      }
    ];
  }
}
