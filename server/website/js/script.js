/** @type {Element[]} */
const fields =
[
  'word',
  'translation',
  'pronunciation',
  'example_sentence',
  'example_translation',
  'test_translation'
];

fields.forEach((id, i) => fields[i] = document.getElementById(id));

function done()
{
  const data = fields.reduce((data, { id, value, innerHTML }) => 
  {
    data[id] = value || innerHTML;
    return data;
  }, {});
}

document.onkeydown = event =>
{
  if(event.ctrlKey && event.key === 'Enter')
    done();
}
