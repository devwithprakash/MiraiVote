import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
      <SignIn />
    </div>
  );
}
