import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

// const font = Poppins({
//   subsets: ["latin"],
//   weight: [ "600"],
// })

export default function Home() {
  return (
    <main className="flex size-full items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="space-y-6 text-center">
        {/* font.className  */}
        <h1 className={cn("text-5xl font-semibold text-white drop-shadow-md")}>
         🔐 Auth
        </h1>
        <p className="text-white text-lg">A simple authentication service</p>
        <div>
          <LoginButton>
            <Button variant="secondary" className="lg">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
