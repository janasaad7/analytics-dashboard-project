import { TRole } from './role.type';

export type TWidgetType = 'line-chart' | 'bar-chart' | 'pie-chart' | 'data-table' | 'stat-card' | 'kpi-gauge';

export interface IWidget {
  id: string;
  type: TWidgetType;
  label: string;
  allowedRoles: TRole[];
  config?: {
    horizontal?: boolean;
  };
}
