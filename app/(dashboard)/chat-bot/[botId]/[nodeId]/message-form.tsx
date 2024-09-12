"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

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

type Props = {
  onSubmit: (values: FormValues) => void;
  disabled: boolean;
  defaultValues: FormValues;
};

export const MessageForm = ({ onSubmit, disabled, defaultValues }: Props) => {
  const [headerType, setHeaderType] = useState<string | undefined>(defaultValues?.headerType);
  const [header, setHeader] = useState<boolean>(defaultValues?.header);
  const [footer, setFooter] = useState<boolean>(defaultValues?.footer);
  const [buttonsAvailable, setButtonsAvailable] = useState<boolean>(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const { isSubmitting } = form.formState;
  const message = form.getValues();

  const submit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <div className="flex flex-row space-x-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
          className="space-y-4 pt-4 min-w-[60%]"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting || disabled}
                    placeholder="Enter message name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="header"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-full">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      // @ts-ignore
                      setHeader(checked);
                    }}
                    disabled={isSubmitting || disabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormDescription>Header</FormDescription>
                </div>
              </FormItem>
            )}
          />
          {header === true && (
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="headerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Header type</FormLabel>
                    <FormControl>
                      <Combobox
                        options={[
                          {
                            label: "Text",
                            value: "text",
                          },
                          {
                            label: "Image",
                            value: "image",
                          },
                          {
                            label: "Video",
                            value: "video",
                          },
                          {
                            label: "Audio",
                            value: "audio",
                          },
                          {
                            label: "Document",
                            value: "document",
                          },
                        ]}
                        value={field.value}
                        onChange={(value?: string) => {
                          field.onChange(value);
                          if (value) {
                            setHeaderType(value);
                          } else {
                            setHeaderType(undefined);
                          }
                        }}
                        disabled={isSubmitting || disabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {headerType === "text" && (
                <FormField
                  name="headerText"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Header Text</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting || disabled}
                          placeholder="Enter header text"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}
          <FormField
            name="bodyMessage"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body message</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isSubmitting || disabled}
                    placeholder="Enter message body message"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="bodyEnding"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body ending</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting || disabled}
                    placeholder="Enter message body ending"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="footer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-full">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      // @ts-ignore
                      setFooter(checked);
                    }}
                    disabled={isSubmitting || disabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormDescription>Footer</FormDescription>
                </div>
              </FormItem>
            )}
          />
          {footer === true && (
            <FormField
              name="footerText"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Footer text</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting || disabled}
                      placeholder="Enter footer text"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="buttonsAvailable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-full">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      // @ts-ignore
                      setButtonsAvailable(checked);
                    }}
                    disabled={isSubmitting || disabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormDescription>Buttons</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button className="w-full" disabled={isSubmitting || disabled}>
            Save
          </Button>
        </form>
      </Form>
      <Card className="w-[40%] bg-[url('https://whatsapp.morasalaty.net/images/wabg.png')] rounded-lg p-6">
        <CardContent>
          <div className="rounded-sm bg-white p-3">
            <div className="font-semibold">{message.headerText}</div>
            <div
              className="font-normal whitespace-break-spaces"
            >
              {message.bodyMessage}
              &nbsp;
              {message.bodyEnding}
            </div>
            <div className="text-slate-500 text-xs">{message.footerText}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
