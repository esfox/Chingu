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

let modal = M.Modal.init(document.getElementById('sent-modal'));

async function done()
{
  const data = fields.reduce((data, { id, value, innerHTML }) => 
  {
    data[id] = value || innerHTML;
    return data;
  }, {});

  await fetch(`https://esfox-chingu.glitch.me/wotd`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  M.toast({html: 'I am a toast!', classes: 'rounded', displayLength: 3600000});
}

document.onkeydown = event =>
{
  if(modal.isOpen && event.key === 'Enter')
    done();
}
