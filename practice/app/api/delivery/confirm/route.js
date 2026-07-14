import { connectDB } from "@/lib/db";
import { posts } from "@/models/post";
import { auth } from "@/auth";

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

    const { postId, confirmed } = await req.json();

    // Validate inputs
    if (!postId) {
      return Response.json(
        { success: false, error: "Missing postId" },
        { status: 400 }
      );
    }

    if (typeof confirmed !== "boolean") {
      return Response.json(
        { success: false, error: "Invalid confirmed value" },
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

    // SECURITY: Verify user is the receiver
    if (post.receiverEmail !== session.user.email) {
      return Response.json(
        { success: false, error: "Only receiver can confirm delivery" },
        { status: 403 }
      );
    }

    // SECURITY: Verify post status is "Delivered" (lender must have set it)
    if (post.status !== "Delivered") {
      return Response.json(
        { success: false, error: "Post must be in Delivered status" },
        { status: 400 }
      );
    }

    // SECURITY: Prevent multiple confirmations
    if (post.deliveryStatus === "confirmed") {
      return Response.json(
        { success: false, error: "Delivery already confirmed" },
        { status: 400 }
      );
    }

    if (confirmed) {
      // Update post with delivery confirmation
      // Also update main status to "Confirmed" to show both parties have confirmed
      await posts.findByIdAndUpdate(postId, {
        status: "Confirmed",
        deliveryStatus: "confirmed",
        paymentStatus: "completed",
        deliveryConfirmedAt: new Date(),
      });

      return Response.json({
        success: true,
        message: "Delivery confirmed! Payment processed (COD).",
        paymentStatus: "completed",
        newStatus: "Confirmed",
      });
    } else {
      // Receiver rejected delivery
      await posts.findByIdAndUpdate(postId, {
        deliveryAttempts: post.deliveryAttempts + 1,
        deliveryStatus: "failed",
        status: "Contacted", // Reset to contacted for discussion
      });

      return Response.json({
        success: true,
        message: "Delivery rejected. Lender has been notified.",
        paymentStatus: "pending",
      });
    }
  } catch (error) {
    console.error("Delivery confirmation error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
