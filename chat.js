"strict";

var cli = require('./cli');
var redis = require("redis");
var publisher = redis.createClient();
var subscriber = redis.createClient();
var me = 'noname';
var COMMAND_DELIMITER = '#|?$';
var ROOM = 'room';
var ENTER = 'ENTER';
var EXIT  = 'EXIT';
var PUBLISH = 'PUBLISH';

exports.enter = function () {
  registerListeners();

  cli.setPrompt('');

  cli.read('Enter your name: ', function (line) {
    me = line;
    console.log('Welcome', line);

    enterRoom();
    startChatting();
  });



  //
};

function startChatting () {
  cli.read('', function (line) {
    if (line.indexOf('\\exit') === 0) {
      return exitRoom();
    }

    executeCommand(PUBLISH, line);
    startChatting();

  });
}

function registerListeners () {
  subscriber.on("message", function(channel, message) {
    switch (channel) {
      case ROOM: {
        parseRoomCommand(message);
        break;
      }
    }
  });
}

function createCommand (cmd, subject, text) {
  return [cmd, subject, text].join(COMMAND_DELIMITER);
}

function parseCommand (command) {
  return command.split(COMMAND_DELIMITER);
}

function exitRoom () {
  executeCommand(EXIT);
  subscriber.unsubscribe(ROOM);
  process.exit(0);
}

function enterRoom () {
  subscriber.subscribe(ROOM);
  executeCommand(ENTER);
}

function executeCommand(cmd, text) {
  publisher.publish(ROOM, createCommand(cmd, me, text));
}

function parseRoomCommand (message) {
  command = parseCommand(message);

  var cmd = command[0];
  var subject = command[1];

  if (subject === me)
    return;

  switch (cmd) {
    case ENTER: {
      console.log(subject, 'join the room');
      break;
    }

    case EXIT: {
      console.log (subject, 'exit the room');
      break;
    }

    case PUBLISH: {
      var text = command[2];
      console.log (subject + ":", text);
    }
  }
}
