/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';

const schema = yup.string().required().url();

const checkValidOfUrl = (url) => {
  try {
    schema.validateSync(url, { abortEarly: false });
    return '';
  } catch (err) {
    return err.inner[0];
  }
};

const updateValodationOfUrl = (state) => {
  const errors = checkValidOfUrl(state.form.url);
  if (_.isEqual(errors, {})) {
    state.form.validOfForm = true;
    state.form.errors = {};
  } else {
    state.form.validOfForm = false;
    state.form.errors = errors;
  }
};

const rendorErrors = (formElement, errors) => {
  console.log(formElement.nextElementSibling);
  console.log(formElement.firstChild);
  const errorElement = formElement.nextElementSibling;
  const inputElement = formElement.firstChild;
  if (errorElement) {
    inputElement.classList.remove('is-invalid');
    errorElement.remove();
  }
  if (!errors) {
    return;
  }
  const errorMessageElement = document.createElement('div');
  errorMessageElement.classList.add('feedback', 'text-danger');
  inputElement.classList.add('is-invalid');
  errorMessageElement.innerHTML = errors.message;
  formElement.after(errorMessageElement);
};

const app = () => {
  const state = {
    form: {
      url: null,
      processState: 'filling',
      validOfForm: true,
      errors: {},
    },
  };

  const form = document.querySelector('[data-form="rss-form"');
  console.log(form);

  const watch = onChange(state, (path) => {
    if (path === 'form.errors') {
      console.log('some');
      console.log(state.form.errors);
      rendorErrors(form, state.form.errors);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    state.form.url = url;
    console.log(url);
    updateValodationOfUrl(watch);
  });
};

export default app;
