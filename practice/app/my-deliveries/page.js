export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import { connectDB } from "@/lib/db";
import { posts } from "@/models/post";
import DeliveryConfirmationContainer from "@/components/DeliveryConfirmationContainer";

const page = async () => {
  "use server";
  const session = await auth();

  if (!session || !session.user?.email) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Please log in to view deliveries</p>
        </div>
      </div>
    );
  }

  await connectDB();

  // Find all posts where current user is the receiver
  const pendingDeliveries = await posts
    .find({ receiverEmail: session.user.email })
    .lean() // Convert to plain objects
    .sort({ createdAt: -1 });

  // Convert MongoDB ObjectIds to strings for serialization
  const serializedDeliveries = pendingDeliveries.map((delivery) => ({
    ...delivery,
    _id: delivery._id.toString(),
    createdAt: delivery.createdAt?.toISOString(),
    updatedAt: delivery.updatedAt?.toISOString(),
    deliveryConfirmedAt: delivery.deliveryConfirmedAt?.toISOString(),
    shippedAt: delivery.shippedAt?.toISOString(),
  }));

  return (
    <div>
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📦 My Deliveries</h1>

        {!pendingDeliveries || pendingDeliveries.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg">No pending deliveries</p>
            <p className="text-gray-500 text-sm mt-2">Delivered items will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {serializedDeliveries.map((delivery) => (
              <DeliveryConfirmationContainer
                key={delivery._id}
                delivery={delivery}
                userEmail={session.user.email}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
