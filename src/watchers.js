import onChange from 'on-change';
import { rendorPosts, rendorErrors } from './renders';

const formWatcher = (form, state) => {
  const watch = onChange(state, (path) => {
    if (path === 'form.errors') {
      rendorErrors(form, state.form.errors);
    }
  });
  return watch;
};

const postWatcher = (state) => {
  const watchPosts = onChange(state, (path) => {
    if (path === 'posts') {
      rendorPosts(state.posts);
    }
  });
  return watchPosts;
};

export { formWatcher, postWatcher };
