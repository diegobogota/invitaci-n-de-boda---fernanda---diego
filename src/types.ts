/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RSVP {
  id: string;
  name: string;
  phone: string;
  attending: boolean;
  guestsCount: number;
  dietary: 'none' | 'celiac' | 'vegetarian' | 'vegan' | 'other';
  dietaryDetails?: string;
  message?: string;
  confirmedAt: string;
}

export interface SongRequest {
  id: string;
  title: string;
  artist: string;
  requestedBy: string;
}
