const { promisify } = require('util');
const runCommand = require('../tools/run-command');

const delay = promisify(setTimeout);

const bindMongoReplicasCommand = (service) => `docker exec cqrs_${service}_mongo0 mongo --eval "rs.initiate();rs.add('${service}_mongo1');rs.add('${service}_mongo2');conf = rs.conf();conf.members[0].priority=2;rs.reconfig(conf);rs.status()"`;

const startInfrastructure = async () => {
  await runCommand('docker-compose -f docker-compose.yml up -d', {
    stdout: true,
  });
  console.log('Waiting 20s before mongo replicas is up');
  await delay(20000);
  console.log('Bind replicas');
  await Promise.all([
    runCommand(bindMongoReplicasCommand('user')),
    runCommand(bindMongoReplicasCommand('billing')),
  ]);
}
startInfrastructure();
