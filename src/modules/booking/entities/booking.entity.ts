export class Booking {
  id: string;
  userId: string;
  eventId: string;
  status: 'pending' | 'approved' | 'rejected';
}
