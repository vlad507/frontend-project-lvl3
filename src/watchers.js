/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import { renderPosts, renderErrors, renderProcessState } from './renders';

const stateWatch = (state, i18next) => {
  const watch = onChange(state, (path) => {
    if (path === 'form.errors') {
      renderErrors(state.form.errors, i18next);
    } else if (path === 'form.processState') {
      renderProcessState(state, i18next);
    } else if (path === 'posts') {
      renderPosts(state.posts);
    }
  });
  return watch;
};

export default stateWatch;
