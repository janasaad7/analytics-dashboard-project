import {Component, inject, input, output} from '@angular/core';
import { IStat } from '../../../core/models/stat.model';
import {RoleAccessDirective} from '../../../core/directives/role-access.directive';
import {CurrencyPipe} from '@angular/common';
import {WidgetWrapperComponent} from '../widget-wrapper/widget-wrapper.component';
import {AppDraggableDirective} from '../../../core/directives/draggable.directive';
import {RoleService} from '../../../core/services/role.service';

@Component({
  selector: 'app-stat-card',
  imports: [
    RoleAccessDirective,
    CurrencyPipe,
    WidgetWrapperComponent,
    AppDraggableDirective
  ],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  stat = input.required<IStat>();
  removeCard = output<string>();

  #roleService   = inject(RoleService);
  currentRole = this.#roleService.currentRole;

  isTrendPositive(): boolean {
    return this.stat().trend === 'up';
  }

  dismissStat(): void {
    this.removeCard.emit(this.stat().id);
  }
}
