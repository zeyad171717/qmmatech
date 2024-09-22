import {
  MessageCircleMore,
  LayoutTemplate,
  Layout,
  Contact,
  Send,
  Bot,
  Megaphone,
  Users,
  UsersRound,
  Building2,
  KeyRound
} from "lucide-react";

import { SidebarItem } from "./sidebar-item";

const routes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Users,
    label: "Users",
    href: "/users",
  },
  {
    icon: UsersRound,
    label: "Teams",
    href: "/teams",
  },
  {
    icon: Building2,
    label: "Organizations",
    href: "/organizations",
  },
  {
    icon: UsersRound,
    label: "Roles",
    href: "/roles",
  },
  {
    icon: KeyRound,
    label: "Permissions",
    href: "/permissions",
  },
  {
    icon: LayoutTemplate,
    label: "Template",
    href: "/templates",
  },
  {
    icon: MessageCircleMore,
    label: "Message",
    href: "/messages",
  },
  {
    icon: Contact,
    label: "Contact",
    href: "/contacts",
  },
  {
    icon: Bot,
    label: "Chat bot",
    href: "/chat-bot",
  },
  {
    icon: Megaphone,
    label: "Alerts",
    href: "/alerts",
  },
];

export const SidebarRoutes = () => {
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.label}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
