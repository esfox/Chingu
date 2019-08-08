const wotdURL = 'https://esfox-chingu.glitch.me/wotd';

/** @type {Element[]} */
const fields =
[
  'word',
  'translation',
  'romanization',
  'example_sentence',
  'example_translation',
  'test_translation'
];

fields.forEach((id, i) => fields[i] = document.getElementById(id));

let modal = M.Modal.init(document.getElementById('send-modal'));

const data = () => fields.reduce((data, { id, value }) => 
{
  data[id] = value;
  return data;
}, {});

async function done()
{
  modal.close();

  await fetch(wotdURL,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data())
  });

  fields.forEach(field => field.value = '');

  M.toast({html: 'New Word of the Day added.', classes: 'rounded'});
}

async function confirm()
{
  const fields = data();
  if(Object.values(fields).some(item => !item))
    return alert('Please fill out all fields.');

  const words = await fetch(wotdURL)
    .then(response => response.json());
  
  if(words.length > 1  && words.some(item => fields.word === item.word))
    return alert(`"${fields.word}" has already been added.`);

  modal.open();
}

document.onkeydown = event =>
{
  if(event.ctrlKey && event.key === 'Enter')
    return confirm();

  if(modal.isOpen && event.key === 'Enter')
    return done();
}

const testTranslation = fields.find(({ id }) => id === 'test_translation');
testTranslation.oninput = () =>
{
  testTranslation.style.height = 0;
  testTranslation.style.height = testTranslation.scrollHeight + 'px';
}
