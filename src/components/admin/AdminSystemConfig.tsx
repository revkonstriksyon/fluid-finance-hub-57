
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export interface AdminSystemConfigProps {
  logs: any[];
  loading: boolean;
}

export const AdminSystemConfig = ({ logs, loading }: AdminSystemConfigProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
        <CardDescription>
          Recent system activity and configurations.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-6 overflow-auto">
        <ScrollArea className="h-[450px] w-full space-y-4">
          {loading ? (
            <div>Loading logs...</div>
          ) : (
            logs.map((log: any) => (
              <div key={log.id} className="flex items-start space-x-4">
                <div className="shrink-0">
                  <Badge variant="secondary">
                    {log.action.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {log.details?.message || log.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Target: {log.target_table} ID: {log.target_id} by Admin:{" "}
                    {log.admin_id} at{" "}
                    {format(new Date(log.created_at), "MMM dd, yyyy hh:mm a")}
                  </p>
                  {log.details && (
                    <pre className="mt-2 w-full rounded-md bg-secondary p-2 text-xs">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
