function parseField(field) {
  return field
    .split(/\[|\]/)
    .filter((s) => s);
}
function getField(req, field) {
  let val = req.body;
  field.forEach(prop => {
    val = val[prop]
  });
  return val;
}
exports.required = (field) => {
  field = parseField(field);
  return (req, res, next) => {
    if (getField(req, field)) {
      next();
    } else {
      let err = new Error(`${field.join(' ')} is required`);
      // res.error(`${field.join(' ')} is required`);
      // res.redirect('back');
      next(err);
    }
  };
};
exports.lengthAbove = (field, len) => {
  field = parseField(field);
  return (req, res, next) => {
    if (getField(req, field).length > len) {
      next();
    } else {
      const fields = field.join(' ');
      let err = new Error(`${fields} mist have more than ${len} characters`);
      // res.error(`${fields} mist have more than ${len} characters`);
      // res.redirect('back');
      next(err);
    }
  };
};