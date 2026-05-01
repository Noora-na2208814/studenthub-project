import prisma from "@/repos/prisma";

class StatsRepo {
  async avgFollowersPerUser() {
    const totalFollows = await prisma.follows.count();
    const totalUsers = await prisma.user.count();
    if (totalUsers === 0) return 0;
    return (totalFollows / totalUsers).toFixed(2);
  }

  async avgPostsPerUser() {
    const totalPosts = await prisma.post.count();
    const totalUsers = await prisma.user.count();
    if (totalUsers === 0) return 0;
    return (totalPosts / totalUsers).toFixed(2);
  }

  async mostActiveUserLastThreeMonths() {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const result = await prisma.post.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: threeMonthsAgo } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 1,
    });

    if (!result.length) return { username: "N/A", postCount: 0 };

    const user = await prisma.user.findUnique({
      where: { id: result[0].userId },
      select: { username: true },
    });

    return { username: user.username, postCount: result[0]._count.id };
  }
  
  async mostLikedPost() {
    const result = await prisma.like.groupBy({
      by: ["postId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 1,
    });

    if (!result.length) return null;

    const post = await prisma.post.findUnique({
      where: { id: result[0].postId },
      include: { user: { select: { username: true } } },
    });

    return {
      content:
        post.content.length > 60
          ? post.content.slice(0, 60) + "..."
          : post.content,
      author: post.user.username,
      likeCount: result[0]._count.id,
    };
  }

  async topFollowedUsers() {
    const result = await prisma.follows.groupBy({
      by: ["followingId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const users = await prisma.user.findMany({
      where: { id: { in: result.map((r) => r.followingId) } },
      select: { id: true, username: true },
    });

    return result.map((r) => {
      const user = users.find((u) => u.id === r.followingId);
      return {
        username: user?.username ?? "Unknown",
        followerCount: r._count.id,
      };
    });
  }

  async mostCommentedPost() {
    const result = await prisma.comment.groupBy({
      by: ["postId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 1,
    });

    if (!result.length) return null;

    const post = await prisma.post.findUnique({
      where: { id: result[0].postId },
      include: { user: { select: { username: true } } },
    });

    return {
      content:
        post.content.length > 60
          ? post.content.slice(0, 60) + "..."
          : post.content,
      author: post.user.username,
      commentCount: result[0]._count.id,
    };
  }

  async getAll() {
    const [
      avgFollowers,
      avgPosts,
      mostActive,
      mostLiked,
      topFollowed,
      mostCommented,
    ] = await Promise.all([
      this.avgFollowersPerUser(),
      this.avgPostsPerUser(),
      this.mostActiveUserLastThreeMonths(),
      this.mostLikedPost(),
      this.topFollowedUsers(),
      this.mostCommentedPost(),
    ]);

    return {
      avgFollowers,
      avgPosts,
      mostActive,
      mostLiked,
      topFollowed,
      mostCommented,
    };
  }
}

export default new StatsRepo();
