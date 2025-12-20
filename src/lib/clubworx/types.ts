export interface ClubworxMember {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  contact_key: string;
  member_number: string | null;
  dob: string;
  address: string;
  last_attended: string;
  location_id: string | null;
  location_name: string | null;
  source: string;
  created_on: string;
  created: number;
}

export interface ClubworxEvent {
  event_id: number;
  event_name: string;
  event_start_at: string;
  event_end_at: string;
  location_id: number;
  location_name: string;
  free_class: boolean;
  instructor_name: string;
  event_full: boolean;
  spaces_available: number;
  event_description: string;
}

export interface ClubworxBooking {
  booking_id: number;
  event_id: number;
  event_name: string;
  event_start_at: string;
  event_end_at: string;
  location_id: number;
  location_name: string;
  instructor_name: string;
  state: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_key: string;
}
