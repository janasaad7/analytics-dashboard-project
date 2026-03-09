import {IWidget} from '../../core/models/widget.model';

export const DASHBOARD_WIDGETS: IWidget[] = [
  {
    id: 'line-sales',
    type: 'line-chart',
    label: 'Sales Over Time',
    allowedRoles: ['admin', 'manager', 'viewer'],
  },
  {
    id: 'pie-categories',
    type: 'pie-chart',
    label: 'Sales by Category',
    allowedRoles: ['admin', 'manager', 'viewer'],
  },
  {
    id: 'bar-sales-region',
    type: 'bar-chart',
    label: 'Sales by Region',
    allowedRoles: ['admin', 'manager'],
    config: { horizontal: false },
  },
  {
    id: 'bar-regional-growth',
    type: 'bar-chart',
    label: 'Regional Growth',
    allowedRoles: ['admin', 'manager'],
    config: { horizontal: true },
  },
  {
    id: 'data-table',
    type: 'data-table',
    label: 'Users Table',
    allowedRoles: ['admin', 'manager'],
  },
  {
    id: 'stat-cards',
    type: 'stat-card',
    label: 'Stats Cards',
    allowedRoles: ['admin', 'manager', 'viewer'],
  },
  {
    id: 'kpi-gauges',
    type: 'kpi-gauge',
    label: 'KPI Gauges',
    allowedRoles: ['admin', 'manager', 'viewer'],
  },
];
