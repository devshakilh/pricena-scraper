import { randomUUID } from 'crypto';

export function genId(): string {
  return randomUUID();
}