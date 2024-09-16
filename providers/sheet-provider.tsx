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

import { NewLinkedMessageSheet } from "@/features/linked-messages/components/new-linked-message-sheet";
import { EditLinkedMessageSheet } from "@/features/linked-messages/components/edit-linked-message-sheet";

import { NewInteractiveWordSheet } from "@/features/interactive-words/components/new-interactive-word-sheet";
import { EditInteractiveWordSheet } from "@/features/interactive-words/components/edit-interactive-word-sheet";

import { NewAlertSheet } from "@/features/alerts/components/new-alert-sheet";
import { EditAlertSheet } from "@/features/alerts/components/edit-alert-sheet";

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

      <NewLinkedMessageSheet />
      <EditLinkedMessageSheet />

      <NewInteractiveWordSheet />
      <EditInteractiveWordSheet />

      <NewAlertSheet />
      <EditAlertSheet />
    </>
  );
};

export default SheetProvider;
