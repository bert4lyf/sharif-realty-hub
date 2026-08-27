import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "./sign-in";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign In / Login | Sharif Realty" },
      {
        name: "description",
        content: "Sign in to Sharif Realty to manage listings and access your dashboard.",
      },
    ],
  }),
  component: SignInPage,
});

