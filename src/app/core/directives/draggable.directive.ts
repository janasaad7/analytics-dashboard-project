import { Directive, ElementRef, inject, input, Renderer2, effect } from '@angular/core';
import { WidgetStateManager } from '../services/widget-state-manager.service';

@Directive({
  selector: '[appDraggable]',
  standalone: true,
  host: {
    '(dragstart)': 'onDragStart($event)',
    '(dragend)':   'onDragEnd()',
    '(dragover)':  'onDragOver($event)',
    '(dragleave)': 'onDragLeave()',
    '(drop)':      'onDrop($event)',
  }
})
export class AppDraggableDirective {
  #el = inject<ElementRef<HTMLElement>>(ElementRef);
  #renderer = inject(Renderer2);
  #widgetState = inject(WidgetStateManager);

  appDraggable = input.required<boolean>();
  appDraggableId = input.required<string>();

  constructor() {
    effect(() => {
      if (this.appDraggable()) {
        this.#renderer.setAttribute(this.#el.nativeElement, 'draggable', 'true');
        this.#renderer.setStyle(this.#el.nativeElement, 'cursor', 'grab');
      } else {
        this.#renderer.removeAttribute(this.#el.nativeElement, 'draggable');
        this.#renderer.removeStyle(this.#el.nativeElement, 'cursor');
      }
    });
  }

  onDragStart(e: DragEvent): void {
    if (!this.appDraggable()) return;
    e.dataTransfer!.setData('widgetId', this.appDraggableId());
    this.#renderer.setStyle(this.#el.nativeElement, 'opacity', '0.4');
  }

  onDragEnd(): void {
    this.#renderer.setStyle(this.#el.nativeElement, 'opacity', '1');
  }

  onDragOver(e: DragEvent): void {
    if (!this.appDraggable()) return;
    e.preventDefault();
    this.#renderer.setStyle(this.#el.nativeElement, 'border', '2px dashed var(--primary-color)');
  }

  onDragLeave(): void {
    this.#renderer.removeStyle(this.#el.nativeElement, 'border');
  }

  onDrop(e: DragEvent): void {
    if (!this.appDraggable()) return;
    e.preventDefault();
    this.#renderer.removeStyle(this.#el.nativeElement, 'border');

    const draggedId = e.dataTransfer!.getData('widgetId');
    const targetId  = this.appDraggableId();

    if (draggedId && draggedId !== targetId) {
      this.#widgetState.reorderWidgets(draggedId, targetId);
    }
  }
}
