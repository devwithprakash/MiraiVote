import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex bg-[#0b1120] min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
