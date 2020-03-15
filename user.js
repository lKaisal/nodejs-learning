const User = require('./models/user');
const user = new User({ name: 'Example', pass: 'test' });
user.save(err => {
  if (err) console.log(err);
  console.log('user id %d', user.id);
});