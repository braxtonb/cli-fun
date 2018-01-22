const Hello = require('./lib/welcomeMat');
const PromptUser = require('./lib/input');
const Commands = require('./lib/commands');

const start = () => {
  Hello();
  PromptUser();
};

start();
