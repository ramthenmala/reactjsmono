/// <reference types='vitest' />
import { createAppConfig } from '../../vite.config.base';

export default createAppConfig({
  appName: 'webclient',
  defaultPort: '4201',
  envPortKey: 'WEBCLIENT_PORT',
  appPath: __dirname,
});
