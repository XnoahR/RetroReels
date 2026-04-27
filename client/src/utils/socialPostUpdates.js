const postUpdateCacheKey = 'socialPostUpdates';
const postUpdatedEventName = 'retro-reels:post-updated';

export const readPostUpdates = () => {
  try {
    const rawUpdates = sessionStorage.getItem(postUpdateCacheKey);
    return rawUpdates ? JSON.parse(rawUpdates) : {};
  } catch {
    sessionStorage.removeItem(postUpdateCacheKey);
    return {};
  }
};

export const writePostUpdate = (post) => {
  if (!post?.id) return;

  const updates = readPostUpdates();
  updates[post.id] = post;
  sessionStorage.setItem(postUpdateCacheKey, JSON.stringify(updates));
  window.dispatchEvent(new CustomEvent(postUpdatedEventName, { detail: { post } }));
};

export const mergePostUpdates = (posts) => {
  const updates = readPostUpdates();
  return posts.map((post) => updates[post.id] || post);
};

export { postUpdateCacheKey, postUpdatedEventName };
