/* eslint-disable no-param-reassign */
import axios from 'axios';
import isUrlAdded from './utils';

const cors = 'https://cors-anywhere.herokuapp.com';

const handlerRSS = (state) => {
  const newURL = new URL(`/${state.form.url}`, cors);
  try {
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
        state.posts = [...state.posts, posts];
        state.feeds = [...state.feeds, { title, description, url: state.form.url }];
      }
      console.log(state.posts);
      console.log(state.feeds);
    });
  } catch (err) {
    console.log(err);
  }
};

export default handlerRSS;
