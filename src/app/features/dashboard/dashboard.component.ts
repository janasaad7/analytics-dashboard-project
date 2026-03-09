import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {WidgetStateManager} from '../../core/services/widget-state-manager.service';
import {LineChartComponent} from '../widgets/line-chart/line-chart.component';
import {StatsGridComponent} from '../widgets/stats-grid/stats-grid.component';
import {PieChartComponent} from '../widgets/pie-chart/pie-chart.component';
import {KpisGridComponent} from '../widgets/kpis-grid/kpis-grid.component';
import {DataTableComponent} from '../widgets/data-table/data-table.component';
import {RoleAccessDirective} from '../../core/directives/role-access.directive';
import {BarChartComponent} from '../widgets/bar-chart/bar-chart.component';
import {SalesService} from '../../core/services/sales.service';
import {RoleService} from '../../core/services/role.service';
import {ThemeService} from '../../core/services/theme.service';
import {DashboardFilterService} from '../../core/services/dashboard-filter.service';
import {TCategory, TDateRange, TRegion} from '../../core/models/filters.type';
import {TRole} from '../../core/models/role.type';
import {TThemeName} from '../../core/models/theme-name.type';
import {StatsService} from '../../core/services/stats.service';
import {KpiService} from '../../core/services/kpi.service';
import {IWidget} from '../../core/models/widget.model';
import {DASHBOARD_WIDGETS} from './dashboard-widgets.config';
import {ExportService} from '../../core/services/export.service';
import {AppDraggableDirective} from '../../core/directives/draggable.directive';

@Component({
  selector: 'app-dashboard',
  host: {
    '(document:click)': 'onDocumentClick($event)'
  },
  imports: [
    LineChartComponent,
    StatsGridComponent,
    PieChartComponent,
    KpisGridComponent,
    DataTableComponent,
    RoleAccessDirective,
    BarChartComponent,
    AppDraggableDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  #widgetState = inject(WidgetStateManager);
  #roleService   = inject(RoleService);
  #themeService  = inject(ThemeService);
  #filterService = inject(DashboardFilterService);
  #statsService = inject(StatsService);
  #kpiService = inject(KpiService);
  salesService   = inject(SalesService);
  #exportService = inject(ExportService);

  activeWidgets = this.#widgetState.activeWidgets;
  currentTheme = this.#themeService.currentTheme;
  currentRole = this.#roleService.currentRole;
  dateRange = this.#filterService.dateRange;
  category = this.#filterService.category;
  region = this.#filterService.region;

  isExportOpen  = signal(false);
  isAddOpen     = signal(false);

  removedWidgets = computed(() => {
    const activeIds = new Set(this.activeWidgets().map(w => w.id));
    return DASHBOARD_WIDGETS.filter(w => !activeIds.has(w.id));
  });

  onDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.export-dropdown')) this.isExportOpen.set(false);
    if (!target.closest('.add-dropdown'))    this.isAddOpen.set(false);
  }

  ngOnInit(): void {
    this.#widgetState.loadLayout();
  }

  removeWidget(id: string): void {
    this.#widgetState.removeWidget(id);
  }

  addWidget(widget: IWidget): void {
    this.#widgetState.addWidget(widget);
  }

  changeTheme(themeName: TThemeName) {
    this.#themeService.setTheme(themeName);
  }

  changeRole(role: TRole) {
    this.#roleService.setRole(role);
  }

  changeDateRange(dateRange: TDateRange) {
    this.#filterService.setDateRange(dateRange);
  }

  changeCategory(category: TCategory) {
    this.#filterService.setCategory(category);
  }

  changeRegion(region: TRegion) {
    this.#filterService.setRegion(region);
  }

  saveLayout() {
    this.#widgetState.saveLayout();
  }

  resetLayout() {
    this.#widgetState.resetLayout();
    this.#statsService.resetAll();
    this.#kpiService.resetAll();
  }

  exportPDF()   {
    this.#exportService.exportPDF();
  }

  exportExcel() {
    this.#exportService.exportExcel();
  }

  exportCSV()   {
    this.#exportService.exportCSV();
  }

  printLayout() {
    window.print();
  }
}
