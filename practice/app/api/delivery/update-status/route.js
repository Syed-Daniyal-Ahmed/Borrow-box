import { connectDB } from "@/lib/db";
import { posts } from "@/models/post";
import { auth } from "@/auth";

// Allowed status transitions
const ALLOWED_TRANSITIONS = {
  "Open": ["Contacted"],
  "Contacted": ["Shipped", "Open"],
  "Shipped": ["Delivered", "Contacted"],
  "Delivered": ["Contacted"], // Only if receiver rejects
  "Confirmed": ["Contacted"], // Only if dispute/issue occurs
};

export async function POST(req) {
  try {
    const session = await auth();

    // Verify user is authenticated
    if (!session || !session.user) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId, newStatus, receiverEmail } = await req.json();

    // Validate inputs
    if (!postId || !newStatus) {
      return Response.json(
        { success: false, error: "Missing postId or newStatus" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TRANSITIONS[newStatus]) {
      return Response.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    // SECURITY: Prevent lender from manually setting "Confirmed" status
    // "Confirmed" can only be set by receiver via /api/delivery/confirm
    if (newStatus === "Confirmed") {
      return Response.json(
        { success: false, error: "Cannot manually set Confirmed status. Receiver must confirm delivery." },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch the post
    const post = await posts.findById(postId);

    if (!post) {
      return Response.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // SECURITY: Only lender (post creator) can update status
    if (post.email !== session.user.email) {
      return Response.json(
        { success: false, error: "Only lender can update delivery status" },
        { status: 403 }
      );
    }

    // SECURITY: Validate state transition
    const currentStatus = post.status;
    if (!ALLOWED_TRANSITIONS[currentStatus]?.includes(newStatus)) {
      return Response.json(
        {
          success: false,
          error: `Cannot transition from ${currentStatus} to ${newStatus}`,
          allowedTransitions: ALLOWED_TRANSITIONS[currentStatus],
        },
        { status: 400 }
      );
    }

    // SECURITY: If setting to "Shipped", ensure receiverEmail is provided
    if (newStatus === "Shipped") {
      if (!receiverEmail) {
        return Response.json(
          { success: false, error: "Receiver email is required for Shipped status" },
          { status: 400 }
        );
      }
      // Update with receiver email and shipped timestamp
      await posts.findByIdAndUpdate(postId, {
        status: newStatus,
        receiverEmail: receiverEmail,
        shippedAt: new Date(),
        deliveryStatus: "pending",
      });

      return Response.json({
        success: true,
        message: "Item marked as shipped. Receiver will be notified.",
        status: newStatus,
      });
    }

    // For "Delivered" status
    if (newStatus === "Delivered") {
      // SECURITY: Can only mark as Delivered if previously Shipped
      if (currentStatus !== "Shipped") {
        return Response.json(
          { success: false, error: "Can only mark as Delivered from Shipped status" },
          { status: 400 }
        );
      }

      // Ensure receiverEmail exists
      if (!post.receiverEmail) {
        return Response.json(
          { success: false, error: "Receiver email not set" },
          { status: 400 }
        );
      }

      await posts.findByIdAndUpdate(postId, {
        status: newStatus,
        deliveryAttempts: post.deliveryAttempts + 1,
      });

      return Response.json({
        success: true,
        message: "Item marked as delivered. Receiver will get confirmation popup.",
        status: newStatus,
      });
    }

    // For other transitions
    await posts.findByIdAndUpdate(postId, { status: newStatus });

    return Response.json({
      success: true,
      message: `Status updated to ${newStatus}`,
      status: newStatus,
    });
  } catch (error) {
    console.error("Status update error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
