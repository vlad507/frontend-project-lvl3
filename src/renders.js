/* eslint-disable no-param-reassign */
import { isEqual } from 'lodash';
import i18next from 'i18next';

const renderPosts = (posts) => {
  const rssPostsElement = document.querySelector('.rss-links');
  rssPostsElement.innerHTML = '';
  posts.forEach((post) => {
    const postElement = document.createElement('div');
    const postLink = document.createElement('a');
    postLink.setAttribute('href', post.link);
    postLink.innerText = post.title;
    postElement.appendChild(postLink);
    rssPostsElement.appendChild(postElement);
  });
};

const renderErrors = (errors) => {
  const formElement = document.querySelector('[data-form="rss-form"');
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
  const errorMessage = errors.email ? i18next.t(errors.email) : errors;
  errorMessageElement.innerHTML = i18next.t('request.bad', { err: errorMessage });
  formElement.after(errorMessageElement);
};

const renderProcessState = (state) => {
  const button = document.querySelector('button');
  const formElement = document.querySelector('[data-form="rss-form"');
  const inputElement = formElement.firstChild;
  const errorMessageElement = document.createElement('div');
  const { processState } = state.form;
  switch (processState) {
    case 'filling':
      button.disabled = false;
      inputElement.disabled = false;
      break;
    case 'sending':
      button.disabled = true;
      inputElement.disabled = true;
      break;
    case 'finished':
      inputElement.value = '';
      button.disabled = false;
      inputElement.disabled = false;
      if (isEqual(state.form.errors, {})) {
        errorMessageElement.classList.add('feedback', 'text-success');
        errorMessageElement.innerHTML = i18next.t('request.success');
        formElement.after(errorMessageElement);
      }
      break;
    default:
      throw new Error(`Unknown state: ${processState}`);
  }
};

export { renderPosts, renderErrors, renderProcessState };
