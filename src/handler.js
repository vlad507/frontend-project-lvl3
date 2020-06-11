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

const handlerRSS = (state) => {
  const newURL = new URL(`/${state.form.url}`, cors);
  axios({
    method: 'get',
    url: newURL,
  }).then((response) => {
    state.form.processState = 'sending';
    const [newFeed, items] = parser(response.data, state.form.url);
    const indexOfUrl = state.feeds.findIndex(({ url }) => url === state.form.url);
    const feedsLength = state.feeds.length;
    if (indexOfUrl < 0) {
      state.feeds = [...state.feeds, newFeed];
    }
    const posts = [];
    const id = (indexOfUrl < 0) ? feedsLength : indexOfUrl;
    items.forEach((item) => {
      const link = item.querySelector('link').textContent;
      const itemTitle = item.querySelector('title').textContent;
      posts.push({ link, title: itemTitle, id });
    });
    const addedPostsFromSameUrl = state.posts.filter((post) => post.id === id);
    const diffInPosts = differenceBy(posts, addedPostsFromSameUrl, 'link');
    state.posts = [...diffInPosts, ...state.posts];
  }).catch((err) => {
    console.log('error here');
    console.log(err);
    state.form.errors = err;
  });
};

export default handlerRSS;
