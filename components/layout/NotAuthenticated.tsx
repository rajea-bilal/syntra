import React from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function NotAuthenticated() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 dark:bg-zinc-900 px-2">
      <div className="w-full  max-w-sm bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md p-6 flex flex-col gap-4 items-center" style={{ boxShadow: '0 2px 16px 0 rgba(30,41,59,0.06)' }}>
        <h1 className="text-xl md:text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-1 text-center tracking-tight">Sign in to Syntra</h1>
        <p className="text-zinc-400 dark:text-zinc-500 text-center mb-10 text-sm font-normal">Connect your Google account to access your dashboard and analytics.</p>
        <Button
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-neutral-900 dark:bg-zinc-100/90 text-white dark:text-zinc-900 font-normal text-sm shadow-sm hover:bg-neutral-800 dark:hover:bg-zinc-200 transition-colors mb-3"
        >
          <FcGoogle size={20} className="mr-2" />
          Sign in with Google
        </Button>
        <div className="text-xs text-zinc-300 dark:text-zinc-600 text-center mt-1">
          We never post or access your data without permission.
        </div>
      </div>
    </div>
  );
} 