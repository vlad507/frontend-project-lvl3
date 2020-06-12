/* eslint-disable no-param-reassign */
import { isEqual } from 'lodash';

const renderPosts = (posts) => {
  const rssPostsElement = document.querySelector('.rss-links');
  rssPostsElement.innerHTML = '';
  console.log(posts);
  posts.forEach((post) => {
    const postElement = document.createElement('div');
    const postLink = document.createElement('a');
    postLink.setAttribute('href', post.link);
    postLink.innerText = post.title;
    postElement.appendChild(postLink);
    rssPostsElement.appendChild(postElement);
  });
};

const renderErrors = (errors, i18next) => {
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
  errorMessageElement.innerHTML = i18next.t('request.bad', { err: errors });
  formElement.after(errorMessageElement);
};

const renderProcessState = (state, i18next) => {
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
      if (isEqual(state.form.errors, {})) {
        errorMessageElement.classList.add('feedback', 'text-success');
        errorMessageElement.innerHTML = i18next.t('request.success');
        formElement.after(errorMessageElement);
      }
      break;
    default:
      throw new Error(`Unknown state: ${processState}`);
  }
  console.log(button);
};

export { renderPosts, renderErrors, renderProcessState };
