"use client";

import { EditCampaignSheet } from "@/features/campaigns/components/edit-campaign-sheet";
import { NewCampaignSheet } from "@/features/campaigns/components/new-campaign-sheet";

import { EditContactSheet } from "@/features/contacts/components/edit-contact-sheet";
import { NewContactSheet } from "@/features/contacts/components/new-contact-sheet";

import { NewListSheet } from "@/features/lists/components/new-list-sheet";

import { NewTemplateSheet } from "@/features/templates/components/new-template-sheet";
import { EditTemplateSheet } from "@/features/templates/components/edit-template-sheet";

import { NewMessageSheet } from "@/features/messages/components/new-message-sheet";
import { EditMessageSheet } from "@/features/messages/components/edit-message-sheet";

import { useMountedState } from "react-use";

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <NewContactSheet />
      <EditContactSheet />

      <NewCampaignSheet />
      <EditCampaignSheet />

      <NewListSheet />

      <NewTemplateSheet />
      <EditTemplateSheet />

      <NewMessageSheet />
      <EditMessageSheet />
    </>
  );
};

export default SheetProvider;
