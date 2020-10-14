const glob = require('glob');
const rimraf = require('rimraf');
const { promisify } = require('util');
const runCommand = require('../tools/run-command');

const rimrafAsync = promisify(rimraf);
const globAsync = promisify(glob);
const packageManager = 'yarn';

const compile = async () => {
  const outDir = 'packages/protos';
  const srcFolder = 'protos';
  const files = await globAsync('protos/**/*.proto');
  const filesFlatten = files.join(' ');
  const pluginProtocGenGrpc = await runCommand(`${packageManager} bin grpc_tools_node_protoc_plugin`);
  const pluginProtocGenTs = await runCommand(`${packageManager} bin protoc-gen-ts`);

  await rimrafAsync('packages/protos/**/*.{js,d.ts}');
  await runCommand(`${packageManager} grpc_tools_node_protoc \
  --plugin=protoc-gen-grpc=${pluginProtocGenGrpc} \
  -I ${srcFolder} \
  --js_out=import_style=commonjs,binary:${outDir} \
  --grpc_out=${outDir} \
  ${filesFlatten}
  `);
  await runCommand(`${packageManager} grpc_tools_node_protoc \
  --plugin=protoc-gen-ts=${pluginProtocGenTs} \
  --ts_out=${outDir} \
  -I ${srcFolder} \
  ${filesFlatten}
  `);
};
compile();
