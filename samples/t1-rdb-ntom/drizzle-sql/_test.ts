import { expect, test } from "bun:test";
import * as core from "./core/index.ts";

test("all functions", async () => {
  await core.reset();
  const { id: userId } = await core.createUser("aster-void");
  const { id: userId2 } = await core.createUser("another-user");

  const { id: postToLike } = await core.createPost(userId, "Hello,");
  await core.createPost(userId, "World!");
  await core.createPost(userId2, "this should not be found");

  await core.like(userId, postToLike);
  await core.like(userId2, postToLike);

  expect(await core.getAllUsers()).toEqual([
    {
      id: userId,
      name: "aster-void",
    },
    {
      id: userId2,
      name: "another-user",
    },
  ]);

  expect(await core.getPost(postToLike)).toEqual({
    id: postToLike,
    creator: {
      id: userId,
      name: "aster-void",
    },
    content: "Hello,",
    likedBy: [
      {
        id: userId,
        name: "aster-void",
      },
      {
        id: userId2,
        name: "another-user",
      },
    ],
  });

  const { posts } = await core.getUser(userId);
  expect(posts.map((post) => post.content)).toEqual(["Hello,", "World!"]);
  if (!posts[0]) throw new Error("0 posts found");
  expect(await core.getPost(posts[0].id)).toSatisfy(
    (post) => post?.creator.name === "aster-void",
  );
});
