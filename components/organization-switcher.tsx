import { useState } from "react";
import { Combobox } from "./ui/combobox";
import { useGetOrganizations } from "@/features/organizations/api/use-get-organizations";

export const OrganizationSwitcher = () => {
  const [org, setOrg] = useState<string | undefined>("");

  const orgQuery = useGetOrganizations();
  const orgOptions = orgQuery.data?.map((org) => ({
    label: org.name,
    value: org.id,
  }));

  return (
    <Combobox
      onChange={(value) => {
        setOrg(value);
      }}
      value={org}
      options={orgOptions}
    />
  );
};
