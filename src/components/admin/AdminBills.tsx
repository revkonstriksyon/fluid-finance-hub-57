
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

export interface AdminBillsProps {
  bills: any[];
  loading: boolean;
}

export const AdminBills = ({ bills, loading }: AdminBillsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bills and Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading bills...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Bill Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill: any) => (
                <TableRow key={bill.id}>
                  <TableCell>{bill.id}</TableCell>
                  <TableCell>{bill.user_id}</TableCell>
                  <TableCell>{bill.type}</TableCell>
                  <TableCell>${bill.amount}</TableCell>
                  <TableCell>{bill.bill_number}</TableCell>
                  <TableCell>
                    <Badge variant={bill.paid_at ? "default" : "secondary"}>
                      {bill.paid_at ? "Paid" : "Unpaid"}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(bill.created_at), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
