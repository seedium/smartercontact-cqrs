const { spawn } = require('child_process');
const { parseArgsStringToArgv } = require('string-argv');

const runCommand = async (cmd, options = {
  stdout: false,
}) => {
  return new Promise((resolve, reject) => {
    if (!cmd) {
      return reject(new Error('command is not defined'));
    }
    const [exec, ...args] = parseArgsStringToArgv(cmd);
    let childOptions = {};

    if (options.stdout) {
      childOptions = {
        ...childOptions,
        stdio: 'inherit',
      }
    }
    const child = spawn(exec, args, childOptions);
    child.on('exit', resolve);
  });
};

module.exports = runCommand;
