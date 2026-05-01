import prisma from "@/repos/prisma";

class PostsRepo {
  async getFeed(userId) {
    const follows = await prisma.follows.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = follows.map((f) => f.followingId);

    
    const where =
      followingIds.length > 0
        ? { userId: { in: [userId, ...followingIds] } }
        : { userId };

    const posts = await prisma.post.findMany({
      where,
      include: {
        likes: { select: { userId: true } },
        comments: { select: { userId: true, text: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return posts.map((p) => ({
      id: p.id,
      userId: p.userId,
      content: p.content,
      createdAt: p.createdAt,
      likes: p.likes.map((l) => l.userId),
      comments: p.comments,
    }));
  }

  async createPost(userId, content) {
    return await prisma.post.create({
      data: { userId, content },
    });
  }

  async deletePost(postId, userId) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.userId !== userId) throw new Error("Unauthorized");

    
    await prisma.like.deleteMany({ where: { postId } });
    await prisma.comment.deleteMany({ where: { postId } });
    await prisma.post.delete({ where: { id: postId } });
  }

  async toggleLike(postId, userId) {
    const existing = await prisma.like.findFirst({ where: { postId, userId } });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return { liked: false };
    } else {
      await prisma.like.create({ data: { postId, userId } });
      return { liked: true };
    }
  }

  async addComment(postId, userId, text) {
    return await prisma.comment.create({
      data: { postId, userId, text },
    });
  }
}

export default new PostsRepo();
