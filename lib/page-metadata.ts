import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/site-metadata';

export function createPageMetadataFromTitle(
  pageTitle: string,
  description?: string,
): Metadata {
  return createPageMetadata(pageTitle, description);
}
