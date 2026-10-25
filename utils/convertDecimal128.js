const convertDecimal128 = fieldName => {
  return (doc, ret) => {
    if (ret[fieldName] != null) {
      ret[fieldName] = Number(ret[fieldName].toString());
    }

    return ret;
  };
};

module.exports = convertDecimal128;
