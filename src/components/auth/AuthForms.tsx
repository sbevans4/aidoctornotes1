
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { DocumentationExample } from "@/components/auth/DocumentationExample";

interface AuthFormsProps {
  authMode: "signin" | "signup";
  setAuthMode: (mode: "signin" | "signup") => void;
}

export const AuthForms = ({ authMode, setAuthMode }: AuthFormsProps) => {
  return (
    <div className="md:w-2/5 p-8 border-l">
      <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as any)}>
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="signin" className="flex-1">
            Sign In
          </TabsTrigger>
          <TabsTrigger value="signup" className="flex-1">
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <SignInForm />
        </TabsContent>

        <TabsContent value="signup">
          <SignUpForm />
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <DocumentationExample />
      </div>
    </div>
  );
};
