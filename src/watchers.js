/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import { renderPosts, renderErrors, renderProcessState } from './renders';

const formWatcher = (state, i18next) => {
  const watch = onChange(state, (path) => {
    if (path === 'form.errors') {
      renderErrors(state.form.errors, i18next);
    } else if (path === 'form.processState') {
      renderProcessState(state, i18next);
    }
  });
  return watch;
};

const postWatcher = (state, i18next) => {
  const watchPosts = onChange(state, (path) => {
    if (path === 'posts') {
      renderPosts(state.posts);
    } else if (path === 'form.errors') {
      renderErrors(state.form.errors, i18next);
    }
  });
  return watchPosts;
};

export { formWatcher, postWatcher };
