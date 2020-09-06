const fs = require('fs');
const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const { resolve, join } = require('path');
const TscWatchClient = require('tsc-watch/client');
const psTree = require('ps-tree');

const readdir = promisify(fs.readdir);

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
  const process = spawn('yarn', ['node', `services/${service}/build/index.js`]);
  process.stdout.setEncoding('utf8');
  process.stdout.on('data', function(data) {
    console.log(`[${service}] ` + data.toString());
  });  const exitPromise = new Promise(resolve => process.on('exit', resolve));

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
        this.killServices();
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
          console.log(`[${serviceProject}] Successfully built`);
          const killService = run(serviceProject);
          this.serviceKillers.push(killService);
        });
        watch.on('compile_errors', () => {
          console.log(`[${serviceProject}] Compilation error`);
          console.log(`----------------------------------\n`)
        });
        watch.start('--noClear', '--project', project);
        return watch;
      });
  }
  killServices() {
    this.serviceKillers.forEach((servicesKiller) => servicesKiller());
    this.servicesWatches.forEach((serviceWatch) => serviceWatch.kill());
  }
}

const start = async () => {
  const builder = new BuilderManager();
  await builder.start();
};
start();
