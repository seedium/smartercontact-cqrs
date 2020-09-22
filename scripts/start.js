const fs = require('fs');
const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const { resolve, join } = require('path');
const TscWatchClient = require('tsc-watch/client');
const psTree = require('ps-tree');
const runCommand = require('../tools/run-command');

const COLORS = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
}
const readdir = promisify(fs.readdir);
const delay = promisify(setTimeout);

const packagesProjects = {
  core: 'packages/core',
};

const KILL_SIGNAL = '15'; // SIGTERM
let hasPS = true;

const isWindows = process.platform === 'win32';

exec('ps', function(error) {
  if (error) {
    hasPS = false;
  }
});

const killer = (child) => {
  return new Promise(resolve => {
    if (isWindows) {
      exec('taskkill /pid ' + child.pid + ' /T /F', resolve);
    } else {
      if (hasPS) {
        psTree(child.pid, function(err, kids) {
          spawn('kill', ['-' + KILL_SIGNAL, child.pid].concat(kids.map(p => p.PID))).on('close', resolve);
        });
      } else {
        exec('kill -' + KILL_SIGNAL + ' ' + child.pid, resolve);
      }
    }
  });
}

const run = (service) => {
  const process = spawn('yarn', ['workspace', service, 'run', 'start']);
  process.stdout.setEncoding('utf8');
  process.stdout.on('data', function(data) {
    console.log(`${COLORS.yellow}[${service}]${COLORS.reset} ` + data.toString());
  });
  process.stderr.on('data', function (data) {
    console.log(`${COLORS.yellow}[${service}]${COLORS.reset} ` + data.toString());
  });
  const exitPromise = new Promise(resolve => process.on('exit', resolve));

  return function kill() {
    return Promise.all([killer(process), exitPromise]);
  };
}

const getFolders = async (path) => {
  const contents = await readdir(resolve(path), {
    withFileTypes: true,
  });
  return contents
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

class BuilderManager {
  servicesWatches = [];
  serviceKillers = [];
  async start() {
    for (const [packageName, packageProject] of Object.entries(packagesProjects)) {
      const watch = new TscWatchClient();
      watch.on('success', async () => {
        console.log(`[${packageName}] Successfully built`);
        await this.killServices();
        await this.startServices();
      });
      watch.on('compile_errors', () => {
        console.error(`[${packageName}] Compilation error`);
      });
      watch.start('--project', packageProject);
    }
  }

  async startServices() {
    const servicesPath = 'services';
    const servicesProjects = await getFolders(servicesPath);
    this.servicesWatches = Object
      .values(servicesProjects)
      .map((serviceProject) => {
        const project = join(servicesPath, serviceProject);
        const watch = new TscWatchClient();
        watch.on('success', async () => {
          await this.killService(serviceProject);
          console.log(`[${serviceProject}] Successfully built`);
          const killService = run(serviceProject);
          this.serviceKillers.push({
            name: serviceProject,
            killer: killService,
          });
        });
        watch.on('compile_errors', () => {
          console.log(`[${serviceProject}] Compilation error`);
          console.log(`----------------------------------\n`)
        });
        watch.start('--noClear', '--project', project);
        return watch;
      });
  }
  async killServices() {
    await Promise.all(
      this.serviceKillers.map((service) => this.killService(service.name)),
    );
    this.servicesWatches.forEach((serviceWatch) => serviceWatch.kill());
  }
  async killService(serviceName) {
    const serviceKillerIndex = this.serviceKillers.findIndex((service) => service.name === serviceName);
    if (serviceKillerIndex !== -1) {
      const [serviceKiller] = this.serviceKillers.splice(serviceKillerIndex, 1);
      await serviceKiller.killer();
    }
  }
}

const start = async () => {
  console.log('Starting applications');
  await runCommand(`docker-compose up -d zookeeper`, {
    stdout: true,
  });
  await delay(5000);
  await runCommand(`docker-compose up -d`, {
    stdout: true,
  });
  await delay(10000);
  const builder = new BuilderManager();
  await builder.start();
};
start();
