"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageForm } from "./message-form";
import { useGetNode } from "@/features/nodes/api/use-get-node";
import { useGetMessageHeaderTypes } from "@/features/messages/api/use-get-message-header-types";
import { useEditMessage } from "@/features/messages/api/use-edit-message";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useGetMessage } from "@/features/messages/api/use-get-message";
import { SubNodesTable } from "./sub-nodes-table";
import { useGetErrorMessage } from "@/features/error-messages/api/use-get-error-message";
import { useEditErrorMessage } from "@/features/error-messages/api/use-edit-error-message";
import { LinkedMessagesTable } from "./_components/linked-messages-table";
import { InteractiveWordsTable } from "./_components/interactive-words-table";

const formSchema = z.object({
  name: z.string(),
  bodyMessage: z.string(),
  bodyEnding: z.string().optional().nullable(),
  header: z.boolean().default(false),
  headerType: z.string().optional().nullable(),
  headerText: z.string().optional().nullable(),
  footer: z.boolean().default(false),
  footerText: z.string().optional().nullable(),
  buttonsAvailable: z.boolean().default(false),
});

type FormValues = z.input<typeof formSchema>;

const NodeIdPage = ({
  params: { botId, nodeId },
}: {
  params: { botId: string; nodeId: string };
}) => {
  const nodeQuery = useGetNode(nodeId);
  const messageQuery = useGetMessage(nodeQuery.data?.messages?.id);
  const message = messageQuery.data;

  const errorMessageQuery = useGetErrorMessage(
    nodeQuery.data?.errorMessages?.id
  );
  const errorMessage = errorMessageQuery.data;

  const editMutation = useEditMessage(message?.id);
  const editErrorMessageMutation = useEditErrorMessage(message?.id);

  const isPending =
    editMutation.isPending || editErrorMessageMutation.isPending;

  const isLoading =
    nodeQuery.isLoading ||
    messageQuery.isLoading ||
    errorMessageQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values);
  };

  const onEditErrorMessage = (values: FormValues) => {
    editErrorMessageMutation.mutate(values);
  };

  return (
    <Tabs defaultValue="message" className="p-4">
      <TabsList>
        <TabsTrigger value="message">Message</TabsTrigger>
        <TabsTrigger value="sub-nodes">Sub nodes</TabsTrigger>
        <TabsTrigger value="error-message">Error message</TabsTrigger>
        <TabsTrigger value="linked-messages">Linked messages</TabsTrigger>
        <TabsTrigger value="interactive-words">Interactive words</TabsTrigger>
      </TabsList>
      <TabsContent value="message">
        {isLoading ? (
          <Card className="border-none drop-shadow-sm min-h-[500px]">
            <CardContent>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-4 text-muted-foreground animate-spin" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none drop-shadow-sm">
            <CardHeader className="gap-y-2 lg:flex-row lg:items-start lg:justify-between">
              <CardTitle className="text-xl line-clamp-1">Message</CardTitle>
            </CardHeader>
            <CardContent>
              <MessageForm
                disabled={isPending}
                defaultValues={
                  message
                    ? {
                        name: message?.name,
                        bodyMessage: message?.bodyMessage,
                        bodyEnding: message?.bodyEnding,
                        header: message?.header,
                        headerType: message?.headerType,
                        headerText: message?.headerText,
                        footer: message?.footer,
                        footerText: message?.footerText,
                        buttonsAvailable: false,
                      }
                    : {
                        name: "",
                        bodyMessage: "",
                        bodyEnding: "",
                        header: true,
                        headerType: "",
                        headerText: "",
                        footer: true,
                        footerText: "",
                        buttonsAvailable: false,
                      }
                }
                onSubmit={onSubmit}
              />
            </CardContent>
          </Card>
        )}
      </TabsContent>
      <TabsContent value="sub-nodes">
        <SubNodesTable parentId={nodeId} />
      </TabsContent>
      <TabsContent value="error-message">
        {isLoading ? (
          <Card className="border-none drop-shadow-sm min-h-[500px]">
            <CardContent>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-4 text-muted-foreground animate-spin" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none drop-shadow-sm">
            <CardHeader className="gap-y-2 lg:flex-row lg:items-start lg:justify-between">
              <CardTitle className="text-xl line-clamp-1">
                Error message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MessageForm
                disabled={isPending}
                defaultValues={
                  errorMessage
                    ? {
                        name: errorMessage?.name,
                        bodyMessage: errorMessage?.bodyMessage,
                        bodyEnding: errorMessage?.bodyEnding,
                        header: errorMessage?.header,
                        headerType: errorMessage?.headerType,
                        headerText: errorMessage?.headerText,
                        footer: errorMessage?.footer,
                        footerText: errorMessage?.footerText,
                        buttonsAvailable: false,
                      }
                    : {
                        name: "",
                        bodyMessage: "",
                        bodyEnding: "",
                        header: true,
                        headerType: "",
                        headerText: "",
                        footer: true,
                        footerText: "",
                        buttonsAvailable: false,
                      }
                }
                onSubmit={onEditErrorMessage}
              />
            </CardContent>
          </Card>
        )}
      </TabsContent>
      <TabsContent value="linked-messages">
        <LinkedMessagesTable nodeId={nodeId} />
      </TabsContent>
      <TabsContent value="interactive-words">
        <InteractiveWordsTable nodeId={nodeId} />
      </TabsContent>
    </Tabs>
  );
};

export default NodeIdPage;
