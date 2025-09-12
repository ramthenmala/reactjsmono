/// <reference types='vitest' />
import { createAppConfig } from '../../vite.config.base';

export default createAppConfig({
  appName: 'compass-admin',
  defaultPort: '4200',
  envPortKey: 'COMPASS_ADMIN_PORT',
  appPath: __dirname,
});
