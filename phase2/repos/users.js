import prisma from "@/repos/prisma";

class UsersRepo {
  async login(email, password) {
    return await prisma.user.findFirst({
      where: { email, password },
    });
  }

  async register({ username, email, password, bio, profilePicture }) {
    return await prisma.user.create({
      data: {
        username,
        email,
        password,
        bio: bio || null,
        profilePicture: profilePicture || null,
      },
    });
  }

  async getAll() {
    const users = await prisma.user.findMany({
      include: {
        followers: { select: { followerId: true } },
        following: { select: { followingId: true } },
      },
    });

    return users.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      bio: u.bio,
      profilePicture: u.profilePicture,

      followers: u.followers.map((f) => f.followerId),

      following: u.following.map((f) => f.followingId),
    }));
  }

  async updateUser(id, { username, bio, profilePicture }) {
    return await prisma.user.update({
      where: { id },
      data: { username, bio, profilePicture },
    });
  }

  async toggleFollow(followerId, followingId) {
    const existing = await prisma.follows.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (existing) {
      await prisma.follows.delete({ where: { id: existing.id } });
      return { following: false };
    } else {
      await prisma.follows.create({ data: { followerId, followingId } });
      return { following: true };
    }
  }
}

export default new UsersRepo();
