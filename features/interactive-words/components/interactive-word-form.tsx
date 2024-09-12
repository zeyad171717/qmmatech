"use client";

import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Pencil, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";

const formSchema = z.object({
  word: z.string(),
  filter: z.string(),
  messageId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  disabled?: boolean;
  messageOptions: { label: string; value: string }[];
  onDelete?: (id: string) => void;
  id?: string;
};

export const InteractiveWordForm = ({
  defaultValues,
  onSubmit,
  disabled,
  messageOptions,
  onDelete,
  id,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    // @ts-ignore
    onDelete?.(id);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <div className="flex flex-row">
          <FormField
            control={form.control}
            name="filter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Filter</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a filter" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="starts with">Starts with</SelectItem>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="ends with">Ends with</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            name="word"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Word</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting || disabled}
                    placeholder="Enter word"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="messageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Combobox
                  options={messageOptions}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting || disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create Word"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="size-4 mr-2" />
            Delete Word
          </Button>
        )}
      </form>
    </Form>
  );
};
