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

  modal.close();

  fields.forEach(field =>
  {
    if(field.id === 'test_translation')
      field.innerHTML = '';
    else
    {
      field.
      field.value = '';
    }
  });

  M.toast({html: 'New Word of the Day added.', classes: 'rounded'});
}

document.onkeydown = event =>
{
  if(modal.isOpen && event.key === 'Enter')
    done();
}
