var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('> ');
rl.on('close', function() {
  //closeCallback();
  console.log('bye!');
  process.exit(0);
});

exports.setPrompt = function(prompt) {
  rl.setPrompt(prompt);
};

exports.read = function(text, callback) {
  rl.once('line', function(line) {
    callback(line.trim());
  });

  rl.prompt();
  process.stdout.write(text);
};
