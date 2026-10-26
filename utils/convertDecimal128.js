const convertDecimal128 = fieldName => (doc, ret) => {
  if (ret[fieldName] != null) {
    ret[fieldName] = ret[fieldName].toString();
  }

  return ret;
};

module.exports = convertDecimal128;
