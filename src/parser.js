const parse = (responseData, url) => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(responseData, 'text/xml');
  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const items = doc.querySelectorAll('item');
  return [{ title, description, url }, items];
};

export default parse;
