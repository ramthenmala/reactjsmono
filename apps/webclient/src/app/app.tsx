import NxWelcome from './nx-welcome';
import { Button, SocialButton, CloseButton } from '@compass/shared-ui';
import { Layout } from '../components/layout';

export function App() {
  return (
    <Layout>
      <div className="p-8">
        <NxWelcome title="@compass/webclient" />

        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold">WebClient - Shared UI Demo</h2>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Primary Actions</h3>
            <div className="flex gap-4 items-center flex-wrap">
              <Button color="primary" size="lg">
                Get Started
              </Button>
              <Button color="secondary" size="md">
                Learn More
              </Button>
              <CloseButton />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sign In Options</h3>
            <div className="flex gap-4 items-center flex-wrap">
              <SocialButton social="google" size="lg">
                Sign in with Google
              </SocialButton>
              <SocialButton social="facebook" size="md">
                Facebook
              </SocialButton>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
