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

document.addEventListener('DOMContentLoaded', () =>
{
  const elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

async function done()
{
  const data = fields.reduce((data, { id, value, innerHTML }) => 
  {
    data[id] = value || innerHTML;
    return data;
  }, {});

  // await fetch(`https://esfox-chingu.glitch.me/wotd`,
  // {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });


  
  window.location.reload();
}

document.onkeydown = event =>
{
  if(event.ctrlKey && event.key === 'Enter')
    done();
}
