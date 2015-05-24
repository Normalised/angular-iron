module.exports = {
  options: {
    separator: ';'
  },
  dist: {
    src: ['bower_components/baobab/src/baobab.js','.tmp/**/*.js'],
    dest: '.tmp/concat/angular-iron.js'
  }
};
