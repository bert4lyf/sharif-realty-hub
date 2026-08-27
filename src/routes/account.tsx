import { createFileRoute, redirect } from "@tanstack/react-router";
import { ClientDashboardPage } from "./dashboard";

export const Route = createFileRoute("/account")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Account & Client Portal | Sharif Realty" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClientDashboardPage,
});
