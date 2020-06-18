/* eslint-disable no-param-reassign */
import axios from 'axios';
import { differenceBy } from 'lodash';
import * as yup from 'yup';
import parse from './parser';

const cors = 'https://cors-anywhere.herokuapp.com';
const updatePostsTimeout = 5000;

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
    axios({
      method: 'get',
      url: newURL,
    }).then((response) => {
      const [, items] = parse(response.data, feed.url);
      const indexOfUrl = state.feeds.findIndex(({ url }) => url === feed.url);
      const id = indexOfUrl;
      const posts = getPosts(items, id);
      const addedPostsFromSameUrl = state.posts.filter((post) => post.id === id);
      const diffInPosts = differenceBy(posts, addedPostsFromSameUrl, 'link');
      state.posts = [...diffInPosts, ...state.posts];
    }).catch((err) => {
      state.form.errors = err.toJSON().message;
    });
  });

  setTimeout(() => updatePosts(state), updatePostsTimeout);
};

const handlerRSS = (state, i18next) => {
  const feedsUrl = state.feeds.map(({ url }) => url);
  const schema = yup.mixed().notOneOf(feedsUrl);
  try {
    schema.validateSync(state.form.url);
  } catch (err) {
    state.form.errors = i18next.t('request.alreadyAdded');
    state.form.processState = 'filling';
    return;
  }
  const newURL = new URL(`/${state.form.url}`, cors);
  axios({
    method: 'get',
    url: newURL,
  }).then((response) => {
    const [newFeed, items] = parse(response.data, state.form.url);
    const id = state.feeds.length;
    state.feeds = [...state.feeds, newFeed];
    const posts = getPosts(items, id);
    state.posts = [...posts, ...state.posts];
  }).then(() => {
    state.form.processState = 'finished';
    state.form.processState = 'filling';
  }).catch((err) => {
    state.form.errors = err.message;
    state.form.processState = 'filling';
  });
};

export { updatePosts, handlerRSS };
