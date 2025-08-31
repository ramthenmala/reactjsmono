// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import NxWelcome from './nx-welcome';
import {
  Button,
  ButtonUtility,
  CloseButton,
  SocialButton,
  AppStoreButton,
  GooglePlayButton,
  AppStoreButtonOutline,
  Tooltip,
} from '@compassnew/shared-ui';

export function App() {
  return (
    <div className="p-8">
      <NxWelcome title="@compassnew/compass-admin" />

      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold">Shared UI Components Demo</h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Buttons</h3>
          <div className="flex gap-4 items-center flex-wrap">
            <Button color="primary" size="md">
              Primary Button
            </Button>
            <Button color="secondary" size="md">
              Secondary Button
            </Button>
            <Button color="tertiary" size="sm">
              Tertiary Button
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Utility Buttons</h3>
          <div className="flex gap-4 items-center flex-wrap">
            <ButtonUtility icon="⚙️" size="sm" color="secondary">
              Settings
            </ButtonUtility>
            <CloseButton />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Social Buttons</h3>
          <div className="flex gap-4 items-center flex-wrap">
            <SocialButton social="google" size="md">
              Continue with Google
            </SocialButton>
            <SocialButton social="facebook" size="md">
              Continue with Facebook
            </SocialButton>
            <SocialButton social="apple" size="sm">
              Apple
            </SocialButton>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">App Store Buttons</h3>
          <div className="flex gap-4 items-center flex-wrap">
            <AppStoreButton />
            <GooglePlayButton />
            <AppStoreButtonOutline />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tooltips</h3>
          <div className="flex gap-4 items-center flex-wrap">
            <Tooltip text="This is a tooltip!">
              <Button color="secondary" size="sm">
                Hover for tooltip
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
