import {Component, computed, inject, output, signal} from '@angular/core';
import {AllCommunityModule, ColDef, ModuleRegistry, themeQuartz} from 'ag-grid-community';
import {ThemeService} from '../../../core/services/theme.service';
import {UsersService} from '../../../core/services/users.service';
import {WidgetWrapperComponent} from '../widget-wrapper/widget-wrapper.component';
import {AgGridAngular} from 'ag-grid-angular';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-data-table',
  imports: [
    WidgetWrapperComponent,
    AgGridAngular
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent {
  #themeService = inject(ThemeService);
  #userService = inject(UsersService);

  removeTable = output<void>();

  searchQuery = signal('');

  rowData = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const users = this.#userService.users();
    if (!query) return users;
    return users.filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  });

  colDefs: ColDef[] = [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      sortable: false,
      cellRenderer: (params: {value: string}) =>
        `<div style="width:32px;height:32px;margin-top:6px;position:relative;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="position:absolute;border-radius:50%;background:#e5e7eb;padding:4px;">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
          <img
            src="${params.value}"
            alt="User Avatar"
            style="width:32px;height:32px;border-radius:50%;position:absolute;opacity:0;transition:opacity 0.2s;"
            onload="this.style.opacity='1'"
           />
        </div>`,
    },
    {
      field: 'name',
      headerName: 'Name',
      sortable: true,
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      sortable: true,
      flex: 2,
    },
    {
      field: 'role',
      headerName: 'Role',
      sortable: true,
      flex: 1,
    },
    {
      field: 'department',
      headerName: 'Department',
      sortable: true,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      flex: 1,
      cellRenderer: (params: {value: string}) =>
        params.value === 'active'
          ? `<span style="color: #22c55e; font-weight: 600">● Active</span>`
          : `<span style="color: #ef4444; font-weight: 600">● Inactive</span>`,
    },
    {
      field: 'joinDate',
      headerName: 'Joined',
      sortable: true,
      flex: 1,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }),
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      sortable: true,
      flex: 1,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }),
    },
  ];

  defaultColDef = {
    unSortIcon: true,
  };

  initialSortState = [
    { colId: 'name', sort: 'asc' as const }
  ];

  gridTheme = computed(() => {
    const theme = this.#themeService.currentTheme();
    return themeQuartz.withParams({
      backgroundColor: theme.cardBackground,
      foregroundColor: theme.textColor,
      borderColor: theme.gridColor,
      rowHoverColor: theme.gridColor,
      headerBackgroundColor: theme.backgroundColor,
      headerTextColor: theme.textColor,
    });
  });
}
