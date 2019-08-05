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

  fetch(`https://esfox-chingu.glitch.me/wotd`,
  {
    method: 'POST',
    body: data
  });
}

document.onkeydown = event =>
{
  if(event.ctrlKey && event.key === 'Enter')
    done();
}
