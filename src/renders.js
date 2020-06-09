const rendorPosts = (posts) => {
  const rssPostsElement = document.querySelector('.rss-links');
  console.log(rssPostsElement);
  console.log(posts);
  posts.forEach((post) => {
    console.log(post);
    const postElement = document.createElement('div');
    const postLink = document.createElement('a');
    postLink.setAttribute('href', post.link);
    postLink.innerText = post.title;
    postElement.appendChild(postLink);
    rssPostsElement.appendChild(postElement);
  });
};

export default rendorPosts;
