import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Layout } from "../shared/components/Layout";

const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export const ProtectedLayout = () => (
  <ProtectedRoute>
    <Layout />
  </ProtectedRoute>
);

export default ProtectedRoute;
