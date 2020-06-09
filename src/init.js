/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import { isEqual } from 'lodash';
import handlerRSS from './handler';
import { formWatcher, postWatcher } from './watchers';

const schema = yup.string().required().url();

const checkValidOfUrl = (url) => {
  try {
    schema.validateSync(url, { abortEarly: false });
    return {};
  } catch (err) {
    return err.inner[0];
  }
};

const updateValodationOfUrl = (state) => {
  const errors = checkValidOfUrl(state.form.url);
  if (isEqual(errors, {})) {
    state.form.validOfForm = true;
    state.form.errors = {};
  } else {
    state.form.validOfForm = false;
    state.form.errors = errors;
  }
};

const app = () => {
  const state = {
    form: {
      url: null,
      processState: 'filling',
      validOfForm: true,
      errors: {},
    },
    feeds: [],
    posts: [],
  };

  const form = document.querySelector('[data-form="rss-form"');

  const watchedState = formWatcher(form, state);

  const watchedPosts = postWatcher(state);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    state.form.url = url;
    updateValodationOfUrl(watchedState);
    if (state.form.validOfForm) {
      console.log('in state of validForm');
      const inputElement = form.firstChild;
      inputElement.value = '';
      handlerRSS(watchedPosts);
    }
  });
};

export default app;
