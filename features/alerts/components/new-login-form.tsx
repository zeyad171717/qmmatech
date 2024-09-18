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
import { Select as CustomSelect } from "@/components/select";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/date-picker";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  status: z.string(),
  templateId: z.string(),
  alertId: z.string(),
  time: z.string(),
  scheduledDays: z.number(),
  scheduledHours: z.number(),
  scheduledMinutes: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  disabled?: boolean;
  templateOptions: { label: string; value: string }[];
  alertOptions: { label: string; value: string }[];
  id?: string;
};

export const NewLoginForm = ({
  defaultValues,
  onSubmit,
  disabled,
  templateOptions,
  alertOptions,
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="time"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting || disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Immediate">Immediate</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {form.getValues().time === "Scheduled" && (
          <div className="flex flex-row">
            <FormField
              name="scheduledDays"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting || disabled}
                      placeholder="Enter days"
                      type="number"
                      name={field.name}
                      onBlur={field.onBlur}
                      value={field.value}
                      onChange={(e) => {
                        if (e.target.value >= 0) {
                          form.setValue(
                            "scheduledDays",
                            Number(e.target.value)
                          );
                        }
                      }}
                      ref={field.ref}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="scheduledHours"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting || disabled}
                      placeholder="Enter hours"
                      type="number"
                      name={field.name}
                      onBlur={field.onBlur}
                      value={field.value}
                      onChange={(e) => {
                        if (e.target.value >= 0) {
                          form.setValue(
                            "scheduledHours",
                            Number(e.target.value)
                          );
                        }
                      }}
                      ref={field.ref}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="scheduledMinutes"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minutes</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting || disabled}
                      placeholder="Enter minutes"
                      type="number"
                      name={field.name}
                      onBlur={field.onBlur}
                      value={field.value}
                      onChange={(e) => {
                        if (e.target.value >= 0) {
                          form.setValue(
                            "scheduledMinutes",
                            Number(e.target.value)
                          );
                        }
                      }}
                      ref={field.ref}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}
        <FormField
          control={form.control}
          name="alertId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alert</FormLabel>
              <FormControl>
                <Combobox
                  options={alertOptions}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting || disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="status"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting || disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="status-1">Status 1</SelectItem>
                  <SelectItem value="status-2">Status 2</SelectItem>
                  <SelectItem value="status-3">Status 3</SelectItem>
                  <SelectItem value="status-4">Status 4</SelectItem>
                  <SelectItem value="status-5">Status 5</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="templateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Combobox
                  options={templateOptions}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting || disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={disabled || isSubmitting}>
          {id ? "Save changes" : "Create Alert"}
        </Button>
      </form>
    </Form>
  );
};
