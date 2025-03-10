
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

export interface AdminVirtualCardsProps {
  virtualCards: any[];
  loading: boolean;
}

export const AdminVirtualCards = ({ virtualCards, loading }: AdminVirtualCardsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Virtual Cards</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading virtual cards...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Card Number</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {virtualCards.map((card: any) => (
                <TableRow key={card.id}>
                  <TableCell>{card.id}</TableCell>
                  <TableCell>{card.user_id}</TableCell>
                  <TableCell>{card.card_number}</TableCell>
                  <TableCell>${card.balance}</TableCell>
                  <TableCell>
                    <Badge variant={card.is_active ? "default" : "destructive"}>
                      {card.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(card.created_at), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
