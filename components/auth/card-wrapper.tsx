"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { AuthHeader } from "./auth-header";

interface CardWrapperProps {
  label: string;
  title: string;
  children: React.ReactNode;
}

export const CardWrapper = ({ label, title, children }: CardWrapperProps) => {
  return (
    <Card className="xl:w-1/4 md:w-1/2 shadow-md">
      <CardHeader>
        <AuthHeader label={label} title={title} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
