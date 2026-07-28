import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#50f61d] flex items-center justify-center">
      <SignIn />
    </div>
  );
}
