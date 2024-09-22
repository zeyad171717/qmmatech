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

import { NewAbandantCartSheet } from "@/features/alerts/components/new-abandant-cart-sheet";
import { EditAbandantCartSheet } from "@/features/alerts/components/edit-abandant-cart-sheet";

import { NewReceiverGiftSheet } from "@/features/alerts/components/new-receiver-gift-sheet";
import { EditReceiverGiftSheet } from "@/features/alerts/components/edit-receiver-gift-sheet";

import { NewPayOnReceiveSheet } from "@/features/alerts/components/new-pay-on-receive-sheet";
import { EditPayOnReceiveSheet } from "@/features/alerts/components/edit-pay-on-receive-sheet";

import { NewBankTransferSheet } from "@/features/alerts/components/new-bank-transfer-sheet";
import { EditBankTransferSheet } from "@/features/alerts/components/edit-bank-transfer-sheet";

import { NewNewLoginSheet } from "@/features/alerts/components/new-new-login-sheet";
import { EditNewLoginSheet } from "@/features/alerts/components/edit-new-login-sheet";

import { NewUserSheet } from "@/features/users/components/new-user-sheet";
import { EditUserSheet } from "@/features/users/components/edit-user-sheet";

import { NewTeamSheet } from "@/features/teams/components/new-team-sheet";
import { EditTeamSheet } from "@/features/teams/components/edit-team-sheet";

import { NewRoleSheet } from "@/features/roles/components/new-role-sheet";
import { EditRoleSheet } from "@/features/roles/components/edit-role-sheet";

import { NewPermissionSheet } from "@/features/permissions/components/new-permission-sheet";
import { EditPermissionSheet } from "@/features/permissions/components/edit-permission-sheet";

import { NewOrganizationSheet } from "@/features/organizations/components/new-organization-sheet";
import { EditOrganizationSheet } from "@/features/organizations/components/edit-organization-sheet";

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

      <NewAbandantCartSheet />
      <EditAbandantCartSheet />

      <NewReceiverGiftSheet />
      <EditReceiverGiftSheet />

      <NewPayOnReceiveSheet />
      <EditPayOnReceiveSheet />

      <NewBankTransferSheet />
      <EditBankTransferSheet />

      <NewNewLoginSheet />
      <EditNewLoginSheet />

      <NewUserSheet />
      <EditUserSheet />

      <NewTeamSheet />
      <EditTeamSheet />

      <NewRoleSheet />
      <EditRoleSheet />

      <NewPermissionSheet />
      <EditPermissionSheet />

      <NewOrganizationSheet />
      <EditOrganizationSheet />
    </>
  );
};

export default SheetProvider;
