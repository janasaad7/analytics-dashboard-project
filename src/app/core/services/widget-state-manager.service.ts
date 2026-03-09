import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IWidget } from '../models/widget.model';
import { DASHBOARD_WIDGETS } from '../../features/dashboard/dashboard-widgets.config';

@Injectable({ providedIn: 'root' })
export class WidgetStateManager {
  #platformId = inject(PLATFORM_ID);

  #widgets = signal<IWidget[]>(DASHBOARD_WIDGETS);
  activeWidgets = computed(() => this.#widgets());

  addWidget(widget: IWidget): void {
    this.#widgets.update(widgets => [...widgets, widget]);
  }

  removeWidget(id: string): void {
    this.#widgets.update(widgets => widgets.filter(widget => widget.id !== id));
  }

  saveLayout(): void {
    if (!isPlatformBrowser(this.#platformId)) return;
    localStorage.setItem('dashboard_layout', JSON.stringify(this.#widgets()));
  }

  loadLayout(): void {
    if (!isPlatformBrowser(this.#platformId)) return;
    try {
      const raw = localStorage.getItem('dashboard_layout');
      if (!raw) return;
      this.#widgets.set(JSON.parse(raw));
    } catch {
      localStorage.removeItem('dashboard_layout');
    }
  }

  resetLayout(): void {
    if (!isPlatformBrowser(this.#platformId)) return;
    localStorage.removeItem('dashboard_layout');
    this.#widgets.set(DASHBOARD_WIDGETS);
  }

  reorderWidgets(draggedId: string, targetId: string): void {
    this.#widgets.update(ws => {
      const result = [...ws];
      const draggedIndex = result.findIndex(w => w.id === draggedId);
      const targetIndex  = result.findIndex(w => w.id === targetId);
      const [dragged] = result.splice(draggedIndex, 1);
      result.splice(targetIndex, 0, dragged);
      return result;
    });
  }
}
