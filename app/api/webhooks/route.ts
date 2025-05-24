import { createOrUpdateUser, deleteUser } from "@/app/actions/user";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import type { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { type, data }: WebhookEvent = await verifyWebhook(req);
    console.log(`Received event: ${type}`, data);

    switch (type) {
      case "user.created":
      case "user.updated":
        await handleUserCreateOrUpdate(data, type);
        break;
      case "user.deleted":
        await handleUserDelete(data);
        break;
      default:
        console.warn(`Unhandled event type: ${type}`);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}

async function handleUserCreateOrUpdate(data: any, type: string) {
  const {
    id: clerkId,
    first_name = "",
    last_name = "",
    image_url = "",
    email_addresses = [],
  } = data;

  console.log("Webhook received for:", clerkId);

  try {
    const user = await createOrUpdateUser(
      clerkId,
      first_name,
      last_name,
      email_addresses,
      image_url
    );
    console.log("User synced to DB:", user);

    if (type === "user.created" && "id" in user && user.id) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(clerkId, {
        publicMetadata: { prismaUserId: user.id },
      });
      console.log(`Updated Clerk publicMetadata for clerkId: ${clerkId}`);
    }
  } catch (error) {
    console.error("Error syncing user:", error);
    throw error;
  }
}

async function handleUserDelete(data: any) {
  const { id: clerkId } = data;

  try {
    await deleteUser(clerkId ?? "");
    console.log(`Deleted user in DB for clerkId: ${clerkId}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Response("Error deleting user", { status: 400 });
  }
}
