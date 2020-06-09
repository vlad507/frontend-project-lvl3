/* eslint-disable no-param-reassign */
import axios from 'axios';
import { differenceBy } from 'lodash';
import isUrlAdded from './utils';

const cors = 'https://cors-anywhere.herokuapp.com';

const handlerRSS = (state) => {
  const newURL = new URL(`/${state.form.url}`, cors);
  axios({
    method: 'get',
    url: newURL,
  }).then((response) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data, 'text/xml');
    console.log(doc);
    state.form.processState = 'sending';
    const title = doc.querySelector('title').textContent;
    const description = doc.querySelector('description').textContent;
    const items = doc.querySelectorAll('item');
    const posts = [];
    items.forEach((item) => {
      console.log(item);
      const link = item.querySelector('link').textContent;
      const itemTitle = item.querySelector('title').textContent;
      posts.push({ link, title: itemTitle });
    });
    if (!isUrlAdded(state.form.url, state.feeds)) {
      state.posts = [...state.posts, ...posts];
      state.feeds = [...state.feeds, { title, description, url: state.form.url }];
    } else {
      const indexOfFeed = state.feeds.findIndex(({ url }) => url === state.form.url);
      const diff = differenceBy(posts, state.posts[indexOfFeed], 'link');
      state.posts[indexOfFeed] = [...state.posts[indexOfFeed], ...diff];
    }
  }).catch((err) => {
    console.log('error here');
    console.log(err);
    state.form.errors = err;
  });
};

export default handlerRSS;
