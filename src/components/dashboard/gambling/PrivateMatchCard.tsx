
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Copy, Link as LinkIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface PrivateMatchCardProps {
  onCreateMatch: () => void;
}

const PrivateMatchCard = ({ onCreateMatch }: PrivateMatchCardProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [matchName, setMatchName] = useState("");
  const [gameType, setGameType] = useState("poker");
  const [entryFee, setEntryFee] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("4");
  const [isPrivate, setIsPrivate] = useState(true);
  const [matchCreated, setMatchCreated] = useState(false);
  const [matchLink, setMatchLink] = useState("");
  
  const { toast } = useToast();

  const handleOpenDialog = () => {
    setShowDialog(true);
    setMatchCreated(false);
  };

  const handleCloseDialog = () => {
    if (matchCreated) {
      // If match was created, call the parent onCreateMatch callback
      onCreateMatch();
    }
    setShowDialog(false);
    // Reset form
    setMatchName("");
    setGameType("poker");
    setEntryFee("");
    setMaxPlayers("4");
    setIsPrivate(true);
    setMatchCreated(false);
    setMatchLink("");
  };

  const generateMatchLink = () => {
    // In a real app, this would probably be an API call to create a match
    // and get a unique ID. Here we'll simulate it with a random string
    const matchId = Math.random().toString(36).substring(2, 10);
    return `${window.location.origin}/match/${matchId}`;
  };

  const handleCreateMatch = () => {
    if (!matchName || !entryFee) {
      toast({
        title: "Enfòmasyon manke",
        description: "Tanpri ranpli tout chan yo obligatwa yo",
        variant: "destructive"
      });
      return;
    }

    // Generate a match link
    const link = generateMatchLink();
    setMatchLink(link);
    setMatchCreated(true);

    toast({
      title: "Match Prive Kreye",
      description: "Ou kreye yon match prive. Pataje lyen an ak zanmi yo pou yo ka rejwenn ou.",
    });
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(matchLink);
    toast({
      title: "Lyen Kopye",
      description: "Lyen match la kopye nan clipboard ou.",
    });
  };

  return (
    <div className="finance-card">
      <h3 className="section-title mb-6">Match Ant Zanmi</h3>
      
      <div className="flex flex-col items-center justify-center h-[calc(100%-3rem)] border-2 border-dashed border-finance-midGray/30 dark:border-white/10 rounded-lg p-6">
        <Users className="h-12 w-12 text-finance-charcoal/30 dark:text-white/30 mb-4" />
        <h4 className="text-lg font-medium mb-2">Kreye Match Prive</h4>
        <p className="text-center text-finance-charcoal/70 dark:text-white/70 mb-4">
          Envite zanmi yo pou jwe ak parye nan yon match prive
        </p>
        <Button onClick={handleOpenDialog}>
          <Trophy className="h-4 w-4 mr-2" />
          Kreye Match
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{matchCreated ? "Match Kreye!" : "Kreye Match Prive"}</DialogTitle>
            <DialogDescription>
              {matchCreated 
                ? "Match ou a kreye. Pataje lyen an ak zanmi ou yo."
                : "Ranpli enfòmasyon yo pou kreye yon match prive."}
            </DialogDescription>
          </DialogHeader>
          
          {matchCreated ? (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-finance-lightGray/50 dark:bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-finance-blue/20 p-2 rounded-lg mr-3">
                    <Trophy className="h-5 w-5 text-finance-blue" />
                  </div>
                  <div>
                    <p className="font-medium">{matchName}</p>
                    <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                      {gameType === "poker" ? "Poker" : 
                       gameType === "domino" ? "Domino" : 
                       gameType === "dice" ? "Dice" : "Custom Game"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-finance-charcoal/70 dark:text-white/70">Frè Antre:</span>
                    <span className="font-medium ml-1">${entryFee}</span>
                  </div>
                  <div>
                    <span className="text-finance-charcoal/70 dark:text-white/70">Jwè Maksimòm:</span>
                    <span className="font-medium ml-1">{maxPlayers}</span>
                  </div>
                  <div>
                    <span className="text-finance-charcoal/70 dark:text-white/70">Estati:</span>
                    <span className="font-medium ml-1">Ap Tann Jwè</span>
                  </div>
                  <div>
                    <span className="text-finance-charcoal/70 dark:text-white/70">Vizibilite:</span>
                    <span className="font-medium ml-1">{isPrivate ? "Privé" : "Piblik"}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Lyen Pou Pataje</Label>
                <div className="flex space-x-2">
                  <Input value={matchLink} readOnly className="flex-1" />
                  <Button size="icon" onClick={copyLinkToClipboard} type="button">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-finance-charcoal/70 dark:text-white/70">
                  Pataje lyen sa a ak zanmi ou yo pou yo ka rejwenn match la.
                </p>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button className="flex-1" onClick={handleCloseDialog}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Ale Nan Match
                </Button>
                <Button variant="outline" size="icon" className="bg-finance-danger/10 text-finance-danger border-finance-danger/20 hover:bg-finance-danger/20 hover:text-finance-danger" onClick={handleCloseDialog}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="match-name">Non Match</Label>
                <Input 
                  id="match-name" 
                  value={matchName} 
                  onChange={(e) => setMatchName(e.target.value)}
                  placeholder="Ekri non match la"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="game-type">Tip Jwèt</Label>
                <Select value={gameType} onValueChange={setGameType}>
                  <SelectTrigger id="game-type">
                    <SelectValue placeholder="Chwazi tip jwèt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poker">Poker</SelectItem>
                    <SelectItem value="domino">Domino</SelectItem>
                    <SelectItem value="dice">Jwèt Dè</SelectItem>
                    <SelectItem value="custom">Lòt Jwèt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entry-fee">Frè Antre ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70">$</span>
                  <Input 
                    id="entry-fee" 
                    value={entryFee} 
                    onChange={(e) => setEntryFee(e.target.value)}
                    className="pl-8" 
                    placeholder="0.00"
                    type="number"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-players">Kantite Jwè Maksimòm</Label>
                <Select value={maxPlayers} onValueChange={setMaxPlayers}>
                  <SelectTrigger id="max-players">
                    <SelectValue placeholder="Chwazi kantite jwè" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Jwè</SelectItem>
                    <SelectItem value="4">4 Jwè</SelectItem>
                    <SelectItem value="6">6 Jwè</SelectItem>
                    <SelectItem value="8">8 Jwè</SelectItem>
                    <SelectItem value="10">10 Jwè</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="private-match" 
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
                <Label htmlFor="private-match">Match Prive (Sèlman moun ki gen lyen ka antre)</Label>
              </div>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Anile
                </Button>
                <Button onClick={handleCreateMatch}>
                  <Trophy className="h-4 w-4 mr-2" />
                  Kreye Match
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrivateMatchCard;
