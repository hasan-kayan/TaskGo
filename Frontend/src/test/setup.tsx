// src/test/setup.ts
import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

vi.mock('lucide-react', () => ({
  __esModule: true,
  /* ---------- mevcut ikonlar ---------- */
  Eye:        (p: any) => <svg {...p} data-testid="icon-eye" />,
  Edit:       (p: any) => <svg {...p} data-testid="icon-edit" />,
  Trash2:     (p: any) => <svg {...p} data-testid="icon-trash2" />,
  Calendar:   (p: any) => <svg {...p} data-testid="icon-calendar" />,
  User:       (p: any) => <svg {...p} data-testid="icon-user" />,
  Book:       (p: any) => <svg {...p} data-testid="icon-book" />,
  BookOpen:   (p: any) => <svg {...p} data-testid="icon-book-open" />,
  AlertTriangle: (p: any) => <svg {...p} data-testid="icon-alert-triangle" />,
  Filter:     (p: any) => <svg {...p} data-testid="icon-filter" />,
  Search:     (p: any) => <svg {...p} data-testid="icon-search" />,
  X:          (p: any) => <svg {...p} data-testid="icon-x" />,
  /* ---------- yeni eklenen ikonlar ---------- */
  AlertCircle:(p: any) => <svg {...p} data-testid="icon-alert-circle" />,
  Library:    (p: any) => <svg {...p} data-testid="icon-library" />,
}));
