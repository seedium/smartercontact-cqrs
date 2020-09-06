const { spawn } = require('child_process');
const { promisify } = require('util');
const { parseArgsStringToArgv } = require('string-argv');

const delay = promisify(setTimeout);

const bindMongoReplicasCommand = (service) => `docker exec cqrs_${service}_mongo0 mongo --eval "rs.initiate();rs.add('${service}_mongo1');rs.add('${service}_mongo2');conf = rs.conf();conf.members[0].priority=2;rs.reconfig(conf);rs.status()"`;

const run = async (cmd, options = {}) => {
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

const prepare = async () => {
  await run('docker-compose -f docker-compose.yml up -d', {
    stdout: true,
  });
  console.log('Waiting 20s before mongo replicas is up');
  await delay(20000);
  console.log('Bind replicas');
  await Promise.all([
    run(bindMongoReplicasCommand('user')),
    run(bindMongoReplicasCommand('billing')),
  ]);
}
prepare();
