import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus, UserCog } from "lucide-react"

interface AdminUserManagementProps {
  users: any[];
  loading: boolean;
}

export const AdminUserManagement = ({ users, loading }: AdminUserManagementProps) => {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Jere Itilizatè yo</h2>
        <Input
          type="search"
          placeholder="Rechèch pa imèl..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Table>
        <TableCaption>Yon lis tout itilizatè yo nan kont ou.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Imèl</TableHead>
            <TableHead>Kreye nan</TableHead>
            <TableHead className="text-right">Aksyon</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Chajman...
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Pa gen itilizatè yo jwenn.
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.created_at}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <UserCog className="h-4 w-4 mr-2" />
                    Jere
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserMinus className="h-4 w-4 mr-2" />
                    Retire
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Button className="mt-4">
        <UserPlus className="h-4 w-4 mr-2" />
        Ajoute Nouvo Itilizatè
      </Button>
    </div>
  );
};
