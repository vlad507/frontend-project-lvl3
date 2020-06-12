/* eslint-disable no-param-reassign */
import axios from 'axios';
import { differenceBy } from 'lodash';

const cors = 'https://cors-anywhere.herokuapp.com';

const parser = (responseData, url) => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(responseData, 'text/xml');
  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const items = doc.querySelectorAll('item');
  return [{ title, description, url }, items];
};

const getPosts = (items, id) => {
  const posts = [];
  items.forEach((item) => {
    const link = item.querySelector('link').textContent;
    const itemTitle = item.querySelector('title').textContent;
    posts.push({ link, title: itemTitle, id });
  });
  return posts;
};

const updatePosts = (state) => {
  state.feeds.forEach((feed) => {
    const newURL = new URL(`/${feed.url}`, cors);
    console.log(feed.url);
    axios({
      method: 'get',
      url: newURL,
    }).then((response) => {
      const [, items] = parser(response.data, feed.url);
      const indexOfUrl = state.feeds.findIndex(({ url }) => url === feed.url);
      const id = indexOfUrl;
      const posts = getPosts(items, id);
      const addedPostsFromSameUrl = state.posts.filter((post) => post.id === id);
      console.log(`added:${addedPostsFromSameUrl}`);
      const diffInPosts = differenceBy(posts, addedPostsFromSameUrl, 'link');
      console.log(diffInPosts);
      state.posts = [...diffInPosts, ...state.posts];
      console.log(state.posts);
    }).catch((err) => {
      state.form.errors = err.toJSON().message;
    });
  });

  setTimeout(() => updatePosts(state), 30000);
};

const handlerRSS = (state, formState) => {
  const indexOfUrl = state.feeds.findIndex(({ url }) => url === state.form.url);
  console.log(state.feeds);
  console.log(indexOfUrl);
  if (indexOfUrl >= 0) {
    state.form.errors = 'This url already added';
    return;
  }
  const newURL = new URL(`/${state.form.url}`, cors);
  axios({
    method: 'get',
    url: newURL,
  }).then((response) => {
    const [newFeed, items] = parser(response.data, state.form.url);
    const id = state.feeds.length;
    state.feeds = [...state.feeds, newFeed];
    const posts = getPosts(items, id);
    state.posts = [...posts, ...state.posts];
    console.log(state.posts);
  }).then(() => {
    formState.form.processState = 'finished';
    formState.form.processState = 'filling';
  }).catch((err) => {
    state.form.errors = err.toJSON().message;
    formState.form.processState = 'filling';
  });
};

export { updatePosts, handlerRSS };
