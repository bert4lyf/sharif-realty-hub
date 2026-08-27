import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "./about";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About Us | Sharif Realty" },
      {
        name: "description",
        content: "Welcome to Sharif Realty. For All Your Real Estate Needs Residential And Commercial.",
      },
    ],
  }),
  component: AboutPage,
});
