/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import { isEqual } from 'lodash';
import i18next from 'i18next';
import resources from './locales';
import { updatePosts, handlerRSS } from './handler';
import { formWatcher, postWatcher } from './watchers';

const schema = yup.string().required().url();

const checkValidOfUrl = (url) => {
  try {
    schema.validateSync(url, { abortEarly: false });
    return {};
  } catch (err) {
    return err.inner[0].message;
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

  i18next.init(
    {
      lng: 'en',
      resources,
    },
  );
  const watchedForm = formWatcher(state, i18next);
  const watchedPosts = postWatcher(state, i18next);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    state.form.url = url;
    updateValodationOfUrl(watchedForm);
    if (state.form.validOfForm) {
      watchedForm.form.processState = 'sending';
      handlerRSS(watchedPosts, watchedForm, i18next);
    }
  });

  updatePosts(watchedPosts);
};

export default app;
