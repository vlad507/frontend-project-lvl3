import { isEqual } from 'lodash';

const rendorPosts = (posts) => {
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

export { rendorPosts, rendorErrors };
