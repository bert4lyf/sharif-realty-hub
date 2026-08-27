import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "./sign-in";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign In / Register | Sharif Realty Group" },
      {
        name: "description",
        content: "Sign in to Sharif Realty to manage listings and access your dashboard.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignInPage,
});
