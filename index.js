#!/usr/bin/env node

const WelcomeMat = require('./lib/welcomeMat');
const PromptUser = require('./lib/input');
const Commands = require('./lib/commands');

const start = () => {
  WelcomeMat.hello();
  PromptUser();
};

start();
