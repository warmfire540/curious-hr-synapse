import type { GetAccountMembersResponse } from "@usebasejump/shared";

import { createClient } from "@lib/supabase/server";

import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableRow, TableBody, TableCell } from "../ui/table";

import TeamMemberOptions from "./team-member-options";

type Props = {
  accountId: string;
};

export default async function ManageTeamMembers({ accountId }: Props) {
  const supabaseClient = createClient();

  const { data: members } = await supabaseClient.rpc("get_account_members", {
    account_id: accountId,
  });

  const { data } = await supabaseClient.auth.getUser();
  const isPrimaryOwner = members?.find(
    (member: GetAccountMembersResponse[0]) => member.user_id === data.user?.id
  )?.is_primary_owner;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>These are the users in your team</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {members?.map((member: GetAccountMembersResponse[0]) => (
              <TableRow key={member.user_id}>
                <TableCell>
                  <div className="flex gap-x-2">
                    {member.name}
                    <Badge variant={member.account_role === "owner" ? "default" : "outline"}>
                      {member.is_primary_owner ? "Primary Owner" : member.account_role}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {!member.is_primary_owner && (
                    <TeamMemberOptions
                      teamMember={member}
                      accountId={accountId}
                      isPrimaryOwner={isPrimaryOwner ?? false}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
