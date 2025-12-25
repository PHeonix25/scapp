import { gymMasterClient } from "@/lib/gymmaster/client";

type PageProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export const revalidate = 30;

export default async function BookingPage({ params }: PageProps) {
  const resolvedParams = await params;
  const bookingId = Number(resolvedParams.bookingId);
  if (Number.isNaN(bookingId)) {
    return <div>Invalid booking id</div>;
  }

  const attendees = await gymMasterClient.getClassAttendees(bookingId);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Class Attendees</h1>

      {attendees && attendees.length > 0 ? (
        <ul className="divide-y divide-gray-200 bg-white rounded shadow overflow-hidden">
          {attendees.map((name, idx) => (
            <li key={idx} className="p-4">
              <div className="font-medium">{name}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-6 bg-white rounded shadow">No attendees found.</div>
      )}
    </div>
  );
}
