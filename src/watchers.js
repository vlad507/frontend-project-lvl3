/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import { renderPosts, renderErrors, renderProcessState } from './renders';

const stateWatch = (state) => {
  const watch = onChange(state, (path) => {
    if (path === 'form.errors') {
      renderErrors(state.form.errors);
    } else if (path === 'form.processState') {
      renderProcessState(state);
    } else if (path === 'posts') {
      renderPosts(state.posts);
    }
  });
  return watch;
};

export default stateWatch;
