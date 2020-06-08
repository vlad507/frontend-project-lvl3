const isUrlAdded = (formUrl, feeds) => {
  const index = feeds.findIndex(({ url }) => url === formUrl);
  console.log(index);
  console.log(index >= 0);
  return (index >= 0);
};

export default isUrlAdded;
