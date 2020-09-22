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
    let result = '';
    let error = '';
    if (!options.stdout) {
      child.stdout.on('data', (chunk) => {
        result += chunk.toString();
      });
      child.stderr.on('data', (chunk) => {
        error += chunk.toString();
      });
    }
    child.on('exit', () => {
      result = result.trim();
      error = error.trim();
      if (error) {
        return reject(new Error(error));
      }
      return resolve(result);
    });
  });
};

module.exports = runCommand;
