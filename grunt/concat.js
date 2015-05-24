module.exports = {
  options: {
    separator: ';'
  },
  dist: {
    src: ['bower_components/baobab/build/baobab.min.js','.tmp/**/*.js'],
    dest: '.tmp/concat/angular-iron.js'
  }
};
