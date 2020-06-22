const parse = (responseData) => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(responseData, 'text/xml');
  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const itemElements = doc.querySelectorAll('item');
  const items = [];
  itemElements.forEach((itemElement) => {
    const link = itemElement.querySelector('link').textContent;
    const itemTitle = itemElement.querySelector('title').textContent;
    items.push({ link, title: itemTitle });
  });
  return { title, description, items };
};

export default parse;
