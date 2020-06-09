import onChange from 'on-change';
import { isEqual } from 'lodash';
import rendorPosts from './renders';

const rendorErrors = (formElement, errors) => {
  const errorElement = formElement.nextElementSibling;
  const inputElement = formElement.firstChild;
  if (errorElement) {
    inputElement.classList.remove('is-invalid');
    errorElement.remove();
  }
  if (isEqual(errors, {})) {
    return;
  }
  const errorMessageElement = document.createElement('div');
  errorMessageElement.classList.add('feedback', 'text-danger');
  inputElement.classList.add('is-invalid');
  errorMessageElement.innerHTML = errors.message;
  formElement.after(errorMessageElement);
};

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
