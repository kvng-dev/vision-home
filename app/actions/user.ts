import prisma from "@/lib/prisma";

export async function createOrUpdateUser(
  firstName: string,
  lastName: string,
  imageUrl: string,
  emailAddresses: { email_address: string }[],
  clerkId: string
) {
  const users = await prisma.user.findMany();
  console.log("User count in DB:", users.length);

  const email = emailAddresses?.[0]?.email_address ?? "";

  try {
    const user = await prisma.user.upsert({
      where: {
        clerkId,
      },
      update: {
        firstName,
        lastName,
        email,
        profilePicture: imageUrl,
      },
      create: {
        clerkId,
        firstName,
        lastName,
        email,
        profilePicture: imageUrl,
      },
    });

    return user;
  } catch (error: any) {
    console.error("Error creating or updating user:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { clerkId: id },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting user: ", error);
    return { success: false, error: error.message };
  }
}
