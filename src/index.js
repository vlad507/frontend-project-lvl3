import 'bootstrap/dist/css/bootstrap.min.css';

const createDiv = () => {
  const div = document.createElement('div');
  div.classList.add('jumbotron');
  div.innerHTML = 'Hello, world!';
  const button = document.createElement('a');
  button.classList.add('btn', 'btn-primary', 'btn-lg');
  button.setAttribute('href', '#');
  button.setAttribute('role', 'button');
  const pElement = document.createElement('p');
  pElement.append(button);
  div.append(pElement);
  button.innerHTML = 'Button';
  console.log(div);
  return div;
};

document.body.appendChild(createDiv());
