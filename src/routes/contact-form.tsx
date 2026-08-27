import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "./contact";

export const Route = createFileRoute("/contact-form")({
  head: () => ({
    meta: [
      { title: "Contact Form | Sharif Realty" },
      {
        name: "description",
        content: "How Can We Help You? Contact Sharif Realty via our form or visit our office.",
      },
    ],
  }),
  component: ContactPage,
});
