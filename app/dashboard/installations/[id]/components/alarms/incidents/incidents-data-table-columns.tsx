'use client';

import { ColumnDef } from '@tanstack/react-table';

import { makeDateCell, makeSimpleCell } from '@/lib/table-cells-helper';

export interface AlarmIncidentTableView {
  alarm_configuration: string;
  state: string;
  triggered_at: string;
}

export const columns: ColumnDef<AlarmIncidentTableView>[] = [
  makeSimpleCell('Alarm configuration', 'alarm_configuration', '100px', ''),
  makeDateCell('triggered_at', 'Triggered at'),
  makeSimpleCell('State', 'state'),
];
