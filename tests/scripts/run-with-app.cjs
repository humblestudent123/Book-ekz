const http = require('http');
const { spawn } = require('child_process');

const APP_URL = process.env.E2E_BASE_URL || 'http://localhost:3100';
const npmCommand = 'npm';
const testScript = process.argv[2] || 'cypress:run';

const isAppReady = () =>
  new Promise((resolve) => {
    const request = http.get(APP_URL, (response) => {
      response.resume();
      resolve(response.statusCode >= 200 && response.statusCode < 500);
    });

    request.on('error', () => resolve(false));
    request.setTimeout(1000, () => {
      request.destroy();
      resolve(false);
    });
  });

const waitForApp = async (serverProcess) => {
  const startedAt = Date.now();
  const timeoutMs = 120000;

  while (Date.now() - startedAt < timeoutMs) {
    if (await isAppReady()) return;

    if (serverProcess.exitCode !== null) {
      throw new Error(`App server exited before ${APP_URL} became ready.`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timed out waiting for ${APP_URL}.`);
};

const runNpmScript = (scriptName) =>
  spawn(npmCommand, ['run', scriptName], {
    cwd: process.cwd(),
    env: process.env,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

const waitForExit = (childProcess) =>
  new Promise((resolve) => {
    childProcess.on('exit', (code) => resolve(code ?? 1));
  });

const stopProcessTree = (childProcess) =>
  new Promise((resolve) => {
    if (!childProcess || childProcess.killed) {
      resolve();
      return;
    }

    const killer =
      process.platform === 'win32'
        ? spawn('taskkill', ['/pid', String(childProcess.pid), '/T', '/F'], { stdio: 'ignore' })
        : spawn('kill', ['-TERM', String(childProcess.pid)], { stdio: 'ignore' });

    killer.on('exit', () => resolve());
    killer.on('error', () => resolve());
  });

(async () => {
  let serverProcess = null;
  const appWasAlreadyRunning = await isAppReady();

  try {
    if (!appWasAlreadyRunning) {
      serverProcess = runNpmScript('start:ci');
      await waitForApp(serverProcess);
    }

    const testProcess = runNpmScript(testScript);
    const testExitCode = await waitForExit(testProcess);
    process.exitCode = testExitCode;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    if (serverProcess) {
      await stopProcessTree(serverProcess);
    }
  }
})();
