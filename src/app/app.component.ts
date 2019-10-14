import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

interface RowData {
  videoId: string;
  title: string;
  thumbnails: string;
  publishedAt: string;
  description: string;
}

interface Components {
  titleLinksRenderer: any;
  thumbnailsImageRender: any;
}

interface ICellRendererParams {
  value: any;
  valueFormatted: any;
  getValue: () => any;
  setValue: (value: any) => void;
  formatValue: (value: any) => any;
  data: any;
  node: any;
  colDef: any;
  column: any;
  rowIndex: number;
  api: any;
  eGridCell: HTMLElement;
  eParentOfValue: HTMLElement;
  columnApi: any;
  context: any;
  refreshCell: () => void;
}

interface Res {
  etag: string;
  items: any;
  kind: string;
  nextPageToken: string;
  pageInfo: {totalResults: number, resultsPerPage: number};
  regionCode: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  private gridApi;
  private gridColumnApi;

  rowData: RowData[];
  components: Components;
  isCheckShow = false;
  totalItems = 0;
  selectedItems = 0;

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

  titleLinksRenderer = (params: ICellRendererParams) => {
    if (params.value === undefined || params.value === null) {
      return '';
    } else {
      const {videoId, title} = params.data;
      return `<a href='https://www.youtube.com/watch?v=${videoId}' target="_blank">${title}</a>`;
    }
  }

  thumbnailsImageRender = (params: ICellRendererParams) => {
    if (params.value === undefined || params.value === null) {
      return '';
    } else {
      const {thumbnails} = params.data;
      return `<img src='${thumbnails}'>`;
    }
  }

  formatDate = (data: string) => {
    const date = new Date(data);
    const day = date.getDate().toString().length === 1 ? `0${date.getDate()}` : date.getDate();
    const month = (date.getMonth() + 1).toString().length === 1 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    return `${day}/${month}/${date.getFullYear()}`;
  }

  onGridReady = (params: ICellRendererParams) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const data = this.http.get('https://www.googleapis.com/youtube/v3/search?key=AIzaSyDOfT_BO81aEZScosfTYMruJobmpjqNeEk&maxResults=' +
      '50&type=video&part=snippet&q=john');

    data.subscribe((res: Res) => {
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

  onSelectionChanged = (params: ICellRendererParams) => {
    this.selectedItems = params.api.getSelectedRows().length;
  }

  getContextMenuItems = (params: ICellRendererParams) => {
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

  getMainMenuItems = (params: ICellRendererParams) => {
    return [
      {
        name: this.isCheckShow ? 'Hide' : 'Show',
        action: () => {
          this.isCheckShow = !this.isCheckShow;
          this.columnDefs[0].checkboxSelection = this.isCheckShow;
          this.columnDefs[0].headerCheckboxSelection = this.isCheckShow;
          this.gridApi.setColumnDefs(this.columnDefs);
          if (!this.isCheckShow) {
            this.selectedItems = 0;
            params.api.deselectAll();
          }
        }
      }
    ];
  }
}
