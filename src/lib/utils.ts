import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function daysUntil(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getUrgencyColor(daysLeft: number): string {
  if (daysLeft < 0) return 'text-danger';
  if (daysLeft <= 14) return 'text-danger';
  if (daysLeft <= 30) return 'text-warning';
  if (daysLeft <= 60) return 'text-info';
  return 'text-success';
}

export function getUrgencyBg(daysLeft: number): string {
  if (daysLeft < 0) return 'bg-red-100 border-red-300';
  if (daysLeft <= 14) return 'bg-red-50 border-red-200';
  if (daysLeft <= 30) return 'bg-amber-50 border-amber-200';
  if (daysLeft <= 60) return 'bg-cyan-50 border-cyan-200';
  return 'bg-green-50 border-green-200';
}

export function getComplianceColor(score: number): string {
  if (score >= 90) return 'text-success';
  if (score >= 70) return 'text-warning';
  return 'text-danger';
}

export function piInsuranceMinimum(repCount: number): number {
  if (repCount <= 1) return 100_000;
  if (repCount <= 10) return 200_000;
  if (repCount <= 30) return 300_000;
  if (repCount <= 50) return 400_000;
  if (repCount <= 500) return 600_000;
  return 1_000_000;
}

export function licenceFee(repCount: number, halfYear: boolean): number {
  let base: number;
  if (repCount <= 10) base = 330;
  else if (repCount <= 30) base = 660;
  else if (repCount <= 50) base = 1100;
  else if (repCount <= 500) base = 2200;
  else if (repCount <= 1000) base = 5000;
  else base = 5000 + Math.ceil((repCount - 1000) / 1000) * 5000;
  return halfYear ? base / 2 : base;
}
