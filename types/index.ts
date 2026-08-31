export type ArtistType = 'solo' | 'group' | string;

export type ArtistPhotoType = 'avatar' | 'banner' | 'favicon';

export interface Artist {
  id: string;
  name: string;
  type: ArtistType;
  website?: string;
  isActive: boolean;
  isPublic: boolean;
  bio?: string;
  hasAvatar?: boolean;
  hasBanner?: boolean;
  hasFavicon?: boolean;
  avatarUrl?: string;
  bannerUrl?: string;
  faviconUrl?: string;
}

export interface PrintifyProductVariant {
  id: number;
  title?: string;
  price?: number;
  is_enabled?: boolean;
  is_available?: boolean;
  options?: number[];
}

export interface PrintifyProductOptionValue {
  id: number;
  title: string;
  colors?: string[];
}

export interface PrintifyProductOption {
  name?: string;
  type?: string;
  values?: PrintifyProductOptionValue[];
}

export interface PrintifyProduct {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  images?: { src: string; is_default?: boolean; variant_ids?: number[] }[];
  variants?: PrintifyProductVariant[];
  options?: PrintifyProductOption[];
  assigned: boolean;
  artistId?: string;
  artistName?: string;
  artistWebsite?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  link?: string;
  isActive: boolean;
  createdAt?: string;
}
