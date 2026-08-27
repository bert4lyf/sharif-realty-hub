import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "./sign-in";

export const Route = createFileRoute("/add-listing")({
  head: () => ({
    meta: [
      { title: "Add Listing | Sharif Realty" },
      {
        name: "description",
        content: "Sign in to add and manage your property listings.",
      },
    ],
  }),
  component: SignInPage,
});
