const fs = require('fs');
const { spawn } = require('child_process');
const { promisify } = require('util');
const { resolve, join } = require('path');
const TscWatchClient = require('tsc-watch/client');

const readdir = promisify(fs.readdir);

const packagesProjects = {
  core: 'packages/core',
};

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
          const child = spawn('yarn', ['node', `services/${serviceProject}/build/index.js`]);
          child.stdout.setEncoding('utf8');
          child.stdout.on('data', function(data) {
            console.log(`[${serviceProject}] ` + data.toString());
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
  killServices() {
    this.servicesWatches.forEach((serviceWatch) => serviceWatch.kill());
  }
}

const start = async () => {
  const builder = new BuilderManager();
  await builder.start();
};
start();
