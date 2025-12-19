/**
 * Event Lifecycle Hooks
 *
 * These hooks sync event content to ZeroDB when:
 * - An event is created
 * - An event is updated
 * - An event is published
 * - An event is deleted
 */

import zeroDBService from '../../../../services/zerodb';

interface EventData {
  id: number;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  event_type?: string;
  start_date: string;
  end_date?: string;
  timezone?: string;
  is_virtual?: boolean;
  location?: string;
  venue_name?: string;
  city?: string;
  country?: string;
  virtual_url?: string;
  registration_url?: string;
  max_attendees?: number;
  current_attendees?: number;
  is_free?: boolean;
  price?: number;
  status?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  organizer?: { id: number; name: string } | null;
  category?: { id: number; name: string } | null;
}

interface LifecycleEvent {
  result?: EventData;
  params?: {
    where?: { id?: number };
    data?: Partial<EventData>;
  };
}

export default {
  /**
   * After creating an event, sync to ZeroDB
   */
  async afterCreate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      await zeroDBService.syncEvent({
        id: result.id,
        title: result.title,
        slug: result.slug,
        description: result.description,
        short_description: result.short_description,
        event_type: result.event_type,
        start_date: result.start_date,
        end_date: result.end_date,
        timezone: result.timezone,
        is_virtual: result.is_virtual,
        location: result.location,
        venue_name: result.venue_name,
        city: result.city,
        country: result.country,
        virtual_url: result.virtual_url,
        registration_url: result.registration_url,
        max_attendees: result.max_attendees,
        current_attendees: result.current_attendees,
        is_free: result.is_free,
        price: result.price,
        status: result.status,
        publishedAt: result.publishedAt,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        organizer: result.organizer,
        category: result.category,
      });
    } catch (error) {
      console.error('[ZeroDB] Failed to sync event after create:', error);
    }
  },

  /**
   * After updating an event, sync to ZeroDB
   */
  async afterUpdate(event: LifecycleEvent) {
    const { result } = event;
    if (!result) return;

    try {
      await zeroDBService.syncEvent({
        id: result.id,
        title: result.title,
        slug: result.slug,
        description: result.description,
        short_description: result.short_description,
        event_type: result.event_type,
        start_date: result.start_date,
        end_date: result.end_date,
        timezone: result.timezone,
        is_virtual: result.is_virtual,
        location: result.location,
        venue_name: result.venue_name,
        city: result.city,
        country: result.country,
        virtual_url: result.virtual_url,
        registration_url: result.registration_url,
        max_attendees: result.max_attendees,
        current_attendees: result.current_attendees,
        is_free: result.is_free,
        price: result.price,
        status: result.status,
        publishedAt: result.publishedAt,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        organizer: result.organizer,
        category: result.category,
      });
    } catch (error) {
      console.error('[ZeroDB] Failed to sync event after update:', error);
    }
  },

  /**
   * After deleting an event, remove from ZeroDB
   */
  async afterDelete(event: LifecycleEvent) {
    const { result } = event;
    if (!result?.id) return;

    try {
      await zeroDBService.deleteEvent(result.id);
    } catch (error) {
      console.error('[ZeroDB] Failed to delete event:', error);
    }
  },

  /**
   * After deleting many events, remove from ZeroDB
   */
  async afterDeleteMany(event: { params?: { where?: { id?: { $in: number[] } } } }) {
    const ids = event.params?.where?.id?.$in;
    if (!ids?.length) return;

    try {
      for (const id of ids) {
        await zeroDBService.deleteEvent(id);
      }
    } catch (error) {
      console.error('[ZeroDB] Failed to delete events:', error);
    }
  },
};
