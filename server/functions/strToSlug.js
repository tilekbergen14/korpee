function strToSlug(str) {
  let slug = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === " ") {
      slug += "-";
    } else {
      slug += str[i];
    }
  }
  return slug;
}

module.exports = strToSlug;
