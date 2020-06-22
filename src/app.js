/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import { isEqual } from 'lodash';
import i18next from 'i18next';
import resources from './locales';
import { updatePosts, handlerRSS } from './handler';
import stateWatch from './watchers';

const schema = yup.string().required().url();

const checkValidOfUrl = (url) => {
  try {
    schema.validateSync(url, { abortEarly: false });
    return {};
  } catch (err) {
    return err.inner[0].message;
  }
};

const updateValidationState = (state) => {
  const errors = checkValidOfUrl(state.form.url);
  if (isEqual(errors, {})) {
    state.form.valid = true;
    state.form.errors = {};
  } else {
    state.form.valid = false;
    state.form.errors = errors;
  }
};

const app = () => {
  const state = {
    form: {
      url: null,
      processState: 'filling',
      valid: true,
      errors: {},
    },
    feeds: [],
    posts: [],
  };

  const form = document.querySelector('[data-form="rss-form"');

  i18next.init(
    {
      lng: 'en',
      resources,
    },
  );
  const watchedState = stateWatch(state, i18next);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    state.form.url = url;
    updateValidationState(watchedState);
    if (state.form.valid) {
      handlerRSS(watchedState, i18next);
    }
  });

  updatePosts(watchedState);
};

export default app;
