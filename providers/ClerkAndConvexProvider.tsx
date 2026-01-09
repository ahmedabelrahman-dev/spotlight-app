// Polyfill `window` APIs used by some browser-oriented libs when running in
// React Native / Expo where `window` may be undefined. This provides
// no-op `addEventListener`/`removeEventListener` to avoid runtime errors.
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';

if (typeof globalThis.window === 'undefined') {
  (globalThis as any).window = globalThis;
}
// Provide harmless no-op listeners if not present

if (!(window as any).addEventListener)
  (window as any).addEventListener = () => {};

if (!(window as any).removeEventListener)
  (window as any).removeEventListener = () => {};

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function ClerkAndConvexProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

//import { tokenCache } from '@clerk/clerk-expo/token-cache';
