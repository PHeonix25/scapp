export interface GymMasterAgreement {
  id: number;
  name: string;
  body: string;
  points?: string[];
}

export interface GymMasterAnswer {
  answer: string;
  questionid: number;
}

export interface GymMasterAnswerSet {
  answered_on: string;
  answers: GymMasterAnswer[];
}

export interface GymMasterClass {
  id: number;
  classname: string;
  bookingname?: string;
  classid?: number;
  arrival?: string; // date
  starttime?: string; // HH:MM:SS
  endtime?: string; // HH:MM:SS
  start_str?: string; // HH:MM AM
  end_str?: string; // HH:MM AM
  already_booked_id?: number | null;
  availability?: string;
  bookable?: boolean;
  location?: string;
  max_waitinglist?: number;
  multiplebookings?: boolean;
  num_students?: number;
  price?: string;
  seatallocation?: boolean;
  staffname?: string;
  substitute_staff?: boolean;
  waitlist_count?: number;
  dayofweek?: string;
  staffphoto?: string;
  max_students?: number;
  spacesfree?: number;
  bgcolour?: string;
  image?: string;
  description?: string;
  online_instruction?: string;
}

export interface GymMasterClassSchedule {
  id: number;
  name: string;
  classid?: number;
  arrival?: string; // date
  dayofweek?: string;
  starttime?: string;
  endtime?: string;
  availability?: string;
  resourceid?: number;
  location?: string;
  staffid?: string | number;
  staffname?: string;
  staffphoto?: string;
  description?: string;
  companyid?: number;
  companyname?: string;
  max_students?: number;
  spacesfree?: number;
  bgcolour?: string;
  image?: string;
  online_instruction?: string;
}

export interface GymMasterClub {
  id: number;
  name: string;
  billingprovider?: string;
}

export interface GymMasterEquipment {
  id: number;
  name: string;
}

export interface GymMasterLinkedMember {
  id: number;
  firstname: string;
  surname: string;
  relationship?: string;
}

export interface GymMasterMeasurementValue {
  category?: string;
  measurementtypeid?: number;
  name?: string;
  value?: number;
  unit?: string;
  unitgroup?: string;
}

export interface GymMasterMeasurement {
  id: number;
  latest?: boolean;
  measured_on?: string; // date
  photos?: string[];
  values?: GymMasterMeasurementValue[];
}

export interface GymMasterMember {
  id: number;
  firstname: string;
  surname: string;
  email?: string;
  dob?: string; // date
  gender?: string; // 'M' | 'F' | 'O'
  phonecell?: string;
  phonehome?: string;
  addressstreet?: string;
  addresssuburb?: string;
  addresscity?: string;
  addresscountry?: string;
  addressareacode?: string;
  receivesms?: string | boolean;
  receiveemail?: string | boolean;
  goal?: string;
  joindate?: string; // date
  sourcepromotion?: string;
  memberphoto?: string;
  totalvisits?: number;
  totalpts?: number;
  totalclasses?: number;
  linked_members?: GymMasterLinkedMember[];
}

export interface GymMasterMemberCharge {
  postingid: number;
  occurred: string | number; // date (ISO) or timestamp
  note?: string;
  total?: string;
}

export interface GymMasterMemberClassBooking {
  id: number;
  day: string; // date
  starttime?: string;
  endtime?: string;
  start_str?: string;
  end_str?: string;
  name?: string;
  location?: string;
  is_trainer?: boolean;
  seat?: number;
  staffname?: string;
  substitute_staff?: boolean;
  staffphoto?: string;
  description?: string;
  dayofweek?: string;
  max_students?: number;
  spacesfree?: number;
  bgcolour?: string;
  image?: string;
  parentid?: number;
}

export interface GymMasterMemberMembership {
  id: number;
  name?: string;
  price?: string;
  startdate?: string; // date
  enddate?: string | null; // date or "Open Ended"
  visitsused?: number;
  visitlimit?: number;
}

export interface GymMasterMemberPastBooking {
  id: number;
  day: string;
  starttime?: string;
  endtime?: string;
  start_str?: string;
  end_str?: string;
  price?: string;
  location?: string;
  name?: string;
  classid?: number;
  type?: string;
  attended?: boolean;
  previous_rating?: number;
  feedback?: string;
  dayofweek?: string;
  day_str?: string;
}

export interface GymMasterMemberServiceBooking {
  id: number;
  day: string;
  starttime?: string;
  endtime?: string;
  start_str?: string;
  end_str?: string;
  name?: string;
  type?: string;
  room?: string;
  equipment?: string;
}

export interface GymMasterMembership {
  id: number;
  name?: string;
  description?: string;
  price?: string;
  price_tax?: string;
  pricedescription?: string;
  signupfee?: string;
  signupfee_tax?: string;
  signupfee_label?: string;
  onlinecash?: boolean;
  programme_ref?: string;
  programmegroupid?: string | number;
  startdate?: string;
  divisionid?: number;
  divisionname?: string;
  bgcolour?: string;
  hide_signupfee?: boolean;
  maintenance_fee?: string | null;
  maintenance_interval?: string | null;
  promotional_period?: string | null;
  promotional_price?: string | null;
  promotion_period_description?: string | null;
  freeuntil?: string | null;
  freeuntil_available?: boolean;
  promotion_freeuntil_description?: string | null;
  show_pricedescription?: boolean;
  account_credit?: string | null;
  zero_signupfee?: boolean;
  discountdescription?: string | null;
  sortorder?: number;
  companyids?: number[];
}

export interface GymMasterMembershipCancellationReason {
  id: number;
  name: string;
}

export interface GymMasterMemberWaitlist {
  id: number;
  day: string;
  starttime?: string;
  endtime?: string;
  start_str?: string;
  end_str?: string;
  name?: string;
  location?: string;
  is_trainer?: boolean;
  priority?: number;
  staffname?: string;
  substitute_staff?: boolean;
  staffphoto?: string;
  description?: string;
}

export interface GymMasterProduct {
  productid: number;
  name?: string;
  producttype?: string;
  price?: string;
  image?: string;
}

export interface GymMasterPromotion {
  id: number;
  name?: string;
}

export interface GymMasterQuestionOption {
  id: number;
  name?: string;
}

export interface GymMasterQuestion {
  id: number;
  label?: string;
  required?: boolean;
  type?: 'heading' | 'notes' | 'boolean' | 'dropdown' | 'date' | 'text';
  textlength?: number;
  options?: GymMasterQuestionOption[];
  children?: GymMasterQuestion[];
}

export interface GymMasterQuestionnaire {
  id: number;
  name?: string;
  questions?: GymMasterQuestion[];
}

export interface GymMasterResource {
  id: number;
  name?: string;
  companyid?: number;
  companyname?: string;
  resourceimage?: string;
}

export interface GymMasterRoom {
  id: number;
  name?: string;
}

export interface GymMasterSeat {
  seatnum: number;
  taken: boolean;
}

export interface GymMasterService {
  serviceid: number;
  membershipid?: number;
  benefitid?: number;
  servicename?: string;
  status?: string;
  price?: string;
}

export interface GymMasterSession {
  day: string;
  dayofweek?: string;
  bookingstart?: string;
  bookingend?: string;
  start_str?: string;
  end_str?: string;
  price?: string;
  rid?: number;
  btname?: string;
  resourceimage?: string;
}

export interface GymMasterSettings {
  edit_member?: boolean;
  view_member_class_booking?: boolean;
  view_member_pt_booking?: boolean;
  book_pt?: boolean;
  book_classes?: boolean;
  buy_product?: boolean;
  cancel_class_booking?: boolean;
  cancel_pt_booking?: boolean;
  add_membership?: boolean;
  cancel_membership?: boolean;
  add_hold?: boolean;
  upload_photo?: boolean;
  show_attendance?: boolean;
  club_notice?: boolean;
  hide_class_price?: boolean;
  show_class_schedule?: boolean;
  show_measurements?: boolean;
  show_workouts?: boolean;
  show_charges?: boolean;
}

export interface GymMasterWorkoutExercise {
  id: number;
  name?: string;
  description?: string;
  imagelink?: string;
  videolink?: string;
  intensity?: string;
  duration?: string; // HH:MM:SS
  reps?: number;
  rest?: number;
  sets?: number;
  tempo?: string;
  weight?: number;
}

export interface GymMasterWorkout {
  id: number;
  name?: string;
  workdate?: string;
  notes?: string;
  type?: 'weight' | 'cardio';
  values?: GymMasterWorkoutExercise[];
}
