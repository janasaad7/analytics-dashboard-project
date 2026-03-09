import { inject, Injectable } from '@angular/core';
import { SalesService } from './sales.service';
import { StatsService } from './stats.service';
import { KpiService } from './kpi.service';
import { RoleService } from './role.service';
import { WidgetStateManager } from './widget-state-manager.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({ providedIn: 'root' })
export class ExportService {
  #salesService  = inject(SalesService);
  #statsService  = inject(StatsService);
  #kpiService    = inject(KpiService);
  #roleService   = inject(RoleService);
  #widgetState   = inject(WidgetStateManager);


  #activeWidgetTypes() {
    return new Set(this.#widgetState.activeWidgets().map(w => w.type));
  }

  #visibleStats() {
    return this.#statsService.stats().filter(s =>
      s.visible && this.#roleService.hasRole(...s.requiredRoles)
    );
  }

  #visibleKpis() {
    return this.#kpiService.kpis().filter(k =>
      k.visible && this.#roleService.hasRole(...k.requiredRoles)
    );
  }

  #salesRows() {
    const data = this.#salesService.lineChartData();
    const labels = data.labels as string[];
    const amounts = data.datasets[0].data as number[];
    return labels.map((label, i) => ({ Date: label, Sales: amounts[i] }));
  }

  #statsRows() {
    return this.#visibleStats().map(s => ({
      Title: s.title,
      Value: s.value,
      Change: `${s.change}%`,
      Trend: s.trend,
    }));
  }

  #kpiRows() {
    return this.#visibleKpis().map(k => ({
      Name: k.name,
      Current: k.current,
      Target: k.target,
      Unit: k.unit,
      Status: k.status,
    }));
  }

  exportCSV(): void {
    const workBook = XLSX.utils.book_new();
    const types = this.#activeWidgetTypes();

    if (types.has('line-chart')) {
      const ws = XLSX.utils.json_to_sheet(this.#salesRows());
      XLSX.utils.book_append_sheet(workBook, ws, 'Sales');
    }
    if (types.has('stat-card')) {
      const ws = XLSX.utils.json_to_sheet(this.#statsRows());
      XLSX.utils.book_append_sheet(workBook, ws, 'Stats');
    }
    if (types.has('kpi-gauge')) {
      const ws = XLSX.utils.json_to_sheet(this.#kpiRows());
      XLSX.utils.book_append_sheet(workBook, ws, 'KPIs');
    }

    XLSX.writeFile(workBook, 'dashboard-export.csv', { bookType: 'csv' });
  }

  exportExcel(): void {
    const workBook = XLSX.utils.book_new();
    const types = this.#activeWidgetTypes();

    if (types.has('line-chart')) {
      const workSheet = XLSX.utils.json_to_sheet(this.#salesRows());
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Sales');
    }
    if (types.has('stat-card')) {
      const workSheet = XLSX.utils.json_to_sheet(this.#statsRows());
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Stats');
    }
    if (types.has('kpi-gauge')) {
      const workSheet = XLSX.utils.json_to_sheet(this.#kpiRows());
      XLSX.utils.book_append_sheet(workBook, workSheet, 'KPIs');
    }

    XLSX.writeFile(workBook, 'dashboard-export.xlsx');
  }

  exportPDF(): void {
    const doc = new jsPDF();
    const types = this.#activeWidgetTypes();
    let y = 10;

    doc.setFontSize(16);
    doc.text('Analytics Dashboard Export', 14, y);
    y += 10;

    if (types.has('line-chart')) {
      doc.setFontSize(12);
      doc.text('Sales Data', 14, y);
      y += 6;
      autoTable(doc, {
        startY: y,
        head: [['Date', 'Sales']],
        body: this.#salesRows().map(r => [r.Date, r.Sales]),
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    if (types.has('stat-card')) {
      doc.setFontSize(12);
      doc.text('Stats', 14, y);
      y += 6;
      autoTable(doc, {
        startY: y,
        head: [['Title', 'Value', 'Change', 'Trend']],
        body: this.#statsRows().map(r => [r.Title, r.Value, r.Change, r.Trend]),
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    if (types.has('kpi-gauge')) {
      doc.setFontSize(12);
      doc.text('KPIs', 14, y);
      y += 6;
      autoTable(doc, {
        startY: y,
        head: [['Name', 'Current', 'Target', 'Unit', 'Status']],
        body: this.#kpiRows().map(r => [r.Name, r.Current, r.Target, r.Unit, r.Status]),
      });
    }

    doc.save('dashboard-export.pdf');
  }
}
