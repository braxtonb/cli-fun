const Hello = require('./lib/welcomeMat');
const PromptUser = require('./lib/input');

const start = () => {
  Hello();
  PromptUser();
};

start();
