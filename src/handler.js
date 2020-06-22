/* eslint-disable no-param-reassign */
import axios from 'axios';
import { differenceBy, uniqueId } from 'lodash';
import * as yup from 'yup';
import parse from './parser';

const cors = 'https://cors-anywhere.herokuapp.com';
const updatePostsTimeout = 5000;

const updatePosts = (state) => {
  state.feeds.forEach((feed) => {
    const newURL = new URL(`/${feed.url}`, cors);
    axios({
      method: 'get',
      url: newURL,
    }).then((response) => {
      const { items } = parse(response.data);
      const { id } = feed;
      const posts = items.map((item) => ({ ...item, id }));
      const addedPostsFromSameUrl = state.posts.filter((post) => post.id === id);
      const diffInPosts = differenceBy(posts, addedPostsFromSameUrl, 'link');
      state.posts = [...diffInPosts, ...state.posts];
    }).catch((err) => {
      state.form.errors = err.inner[0].message;
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
  state.form.processState = 'sending';
  axios({
    method: 'get',
    url: newURL,
  }).then((response) => {
    const id = uniqueId();
    const { title, description, items } = parse(response.data);
    const newFeed = {
      title,
      description,
      url: state.form.url,
      id,
    };
    state.feeds = [...state.feeds, newFeed];
    const posts = items.map((item) => ({ ...item, id }));
    state.posts = [...posts, ...state.posts];
  }).then(() => {
    state.form.processState = 'finished';
  }).catch((err) => {
    state.form.errors = err.message;
    state.form.processState = 'filling';
  });
};

export { updatePosts, handlerRSS };
