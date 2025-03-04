
import { useState } from 'react';
import { Search, PlusCircle, ArrowUpDown, ChevronsUpDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ETFBonds = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productType, setProductType] = useState("etf");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Sample data for ETFs
  const etfData = [
    { id: 1, symbol: "VTI", name: "Vanguard Total Stock Market ETF", category: "US Equity", aum: "288.5B", expense: 0.03, ytdReturn: 7.42, yield: 1.35, price: 243.78, change: 0.85 },
    { id: 2, symbol: "VOO", name: "Vanguard S&P 500 ETF", category: "US Equity", aum: "344.2B", expense: 0.03, ytdReturn: 6.58, yield: 1.41, price: 445.89, change: 0.72 },
    { id: 3, symbol: "VEA", name: "Vanguard FTSE Developed Markets ETF", category: "International Equity", aum: "112.7B", expense: 0.05, ytdReturn: 2.35, yield: 3.12, price: 48.42, change: -0.25 },
    { id: 4, symbol: "VWO", name: "Vanguard FTSE Emerging Markets ETF", category: "Emerging Markets", aum: "78.4B", expense: 0.08, ytdReturn: -1.82, yield: 3.05, price: 42.18, change: -0.65 },
    { id: 5, symbol: "BND", name: "Vanguard Total Bond Market ETF", category: "US Bond", aum: "95.1B", expense: 0.03, ytdReturn: 0.75, yield: 4.25, price: 72.35, change: 0.12 },
    { id: 6, symbol: "BNDX", name: "Vanguard Total International Bond ETF", category: "International Bond", aum: "48.9B", expense: 0.07, ytdReturn: -0.45, yield: 3.85, price: 48.65, change: -0.08 },
    { id: 7, symbol: "QQQ", name: "Invesco QQQ Trust", category: "US Equity", aum: "222.3B", expense: 0.20, ytdReturn: 10.24, yield: 0.52, price: 434.62, change: 1.25 },
    { id: 8, symbol: "SCHD", name: "Schwab U.S. Dividend Equity ETF", category: "US Equity", aum: "52.1B", expense: 0.06, ytdReturn: 3.18, yield: 3.42, price: 78.55, change: 0.48 },
  ];
  
  // Sample data for bonds
  const bondData = [
    { id: 1, symbol: "VGSH", name: "Vanguard Short-Term Treasury ETF", category: "Government", aum: "18.2B", expense: 0.04, ytdReturn: 0.42, yield: 4.85, price: 57.92, change: 0.05, maturity: "1-3 Years" },
    { id: 2, symbol: "VGIT", name: "Vanguard Intermediate-Term Treasury ETF", category: "Government", aum: "15.4B", expense: 0.04, ytdReturn: 0.58, yield: 4.35, price: 58.67, change: 0.12, maturity: "3-10 Years" },
    { id: 3, symbol: "VGLT", name: "Vanguard Long-Term Treasury ETF", category: "Government", aum: "7.8B", expense: 0.04, ytdReturn: 0.92, yield: 4.15, price: 59.85, change: 0.28, maturity: "10+ Years" },
    { id: 4, symbol: "VCSH", name: "Vanguard Short-Term Corporate Bond ETF", category: "Corporate", aum: "42.3B", expense: 0.04, ytdReturn: 0.65, yield: 5.05, price: 77.34, change: 0.08, maturity: "1-5 Years" },
    { id: 5, symbol: "VCIT", name: "Vanguard Intermediate-Term Corporate Bond ETF", category: "Corporate", aum: "38.7B", expense: 0.04, ytdReturn: 0.78, yield: 4.95, price: 80.25, change: 0.15, maturity: "5-10 Years" },
    { id: 6, symbol: "VCLT", name: "Vanguard Long-Term Corporate Bond ETF", category: "Corporate", aum: "8.2B", expense: 0.04, ytdReturn: 1.12, yield: 5.25, price: 77.42, change: 0.32, maturity: "10+ Years" },
    { id: 7, symbol: "MUB", name: "iShares National Muni Bond ETF", category: "Municipal", aum: "34.1B", expense: 0.07, ytdReturn: 0.54, yield: 2.85, price: 107.85, change: 0.10, maturity: "Various" },
    { id: 8, symbol: "VTIP", name: "Vanguard Short-Term Inflation-Protected Securities ETF", category: "TIPS", aum: "21.5B", expense: 0.04, ytdReturn: 0.32, yield: 4.10, price: 47.65, change: 0.04, maturity: "0-5 Years" },
  ];
  
  // Performance data for sample chart
  const performanceData = [
    { date: "2023-01", vti: 100, bnd: 100 },
    { date: "2023-02", vti: 103.5, bnd: 99.8 },
    { date: "2023-03", vti: 101.2, bnd: 100.2 },
    { date: "2023-04", vti: 104.8, bnd: 99.9 },
    { date: "2023-05", vti: 106.2, bnd: 99.5 },
    { date: "2023-06", vti: 109.5, bnd: 100.4 },
    { date: "2023-07", vti: 112.8, bnd: 100.8 },
    { date: "2023-08", vti: 110.5, bnd: 100.2 },
    { date: "2023-09", vti: 108.2, bnd: 99.7 },
    { date: "2023-10", vti: 113.5, bnd: 99.4 },
    { date: "2023-11", vti: 115.8, bnd: 100.5 },
    { date: "2023-12", vti: 118.2, bnd: 100.9 },
    { date: "2024-01", vti: 120.5, bnd: 101.2 },
    { date: "2024-02", vti: 123.8, bnd: 100.8 },
    { date: "2024-03", vti: 121.5, bnd: 101.5 },
  ];
  
  // Filter and sort data
  const getFilteredData = () => {
    let dataToUse = productType === "etf" ? etfData : bondData;
    
    let filtered = dataToUse.filter(item => {
      const matchesSearch = searchQuery === "" ||
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === "All" || item.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    return filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  };
  
  const filteredData = getFilteredData();
  
  // Extract unique categories for filter
  const categories = productType === "etf" 
    ? [...new Set(etfData.map(item => item.category))]
    : [...new Set(bondData.map(item => item.category))];
  
  // Toggle sort order
  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Konpare Pèfòmans ETF ak Obligasyon</CardTitle>
          <CardDescription>ETF Aksyon vs ETF Obligasyon (Dènye 12 mwa)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={performanceData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVti" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4285F4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBnd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34A853" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#34A853" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area type="monotone" dataKey="vti" stroke="#4285F4" fillOpacity={1} fill="url(#colorVti)" name="VTI (Aksyon)" />
                <Area type="monotone" dataKey="bnd" stroke="#34A853" fillOpacity={1} fill="url(#colorBnd)" name="BND (Obligasyon)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <div className="text-sm font-medium">VTI Kòmansman Ane</div>
              <div className="text-xl font-bold text-green-600">+7.42%</div>
            </div>
            <div>
              <div className="text-sm font-medium">BND Kòmansman Ane</div>
              <div className="text-xl font-bold text-green-600">+0.75%</div>
            </div>
            <div>
              <div className="text-sm font-medium">VTI Rannman</div>
              <div className="text-xl font-bold">1.35%</div>
            </div>
            <div>
              <div className="text-sm font-medium">BND Rannman</div>
              <div className="text-xl font-bold">4.25%</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Tabs value={productType} onValueChange={setProductType} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="etf">ETF</TabsTrigger>
            <TabsTrigger value="bond">Obligasyon</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Chèche pa senbòl, non..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <span className="mr-1">Kategori:</span> {filterCategory}
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterCategory("All")}>
              All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category} 
                onClick={() => setFilterCategory(category)}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort('symbol')}>
                    Senbòl
                    {sortBy === 'symbol' && (
                      <ArrowUpDown className="inline ml-1 h-3 w-3" />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort('name')}>
                    Non
                    {sortBy === 'name' && (
                      <ArrowUpDown className="inline ml-1 h-3 w-3" />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort('category')}>
                    Kategori
                    {sortBy === 'category' && (
                      <ArrowUpDown className="inline ml-1 h-3 w-3" />
                    )}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => toggleSort('expense')}>
                    Frè
                    {sortBy === 'expense' && (
                      <ArrowUpDown className="inline ml-1 h-3 w-3" />
                    )}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => toggleSort('ytdReturn')}>
                    YTD
                    {sortBy === 'ytdReturn' && (
                      <ArrowUpDown className="inline ml-1 h-3 w-3" />
                    )}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => toggleSort('yield')}>
                    Rannman
                    {sortBy === 'yield' && (
                      <ArrowUpDown className="inline ml-1 h-3 w-3" />
                    )}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => toggleSort('price')}>
                    Pri
                    {sortBy === 'price' && (
                      <ArrowUpDown className="inline ml-1 h-3 w-3" />
                    )}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => toggleSort('change')}>
                    Chanjman
                    {sortBy === 'change' && (
                      <ArrowUpDown className="inline ml-1 h-3 w-3" />
                    )}
                  </TableHead>
                  <TableHead className="text-right">Aksyon</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      Pa gen rezilta ki koresponn ak filtè w yo
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.symbol}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.expense}%</TableCell>
                      <TableCell className={`text-right ${item.ytdReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.ytdReturn >= 0 ? '+' : ''}{item.ytdReturn}%
                      </TableCell>
                      <TableCell className="text-right">{item.yield}%</TableCell>
                      <TableCell className="text-right">${item.price}</TableCell>
                      <TableCell className={`text-right ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kat Fè</CardTitle>
            <CardDescription>Enfòmasyon kle sou {productType === "etf" ? "ETF" : "Obligasyon"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              {productType === "etf" 
                ? "ETF (Exchange-Traded Funds) yo se enstriman envestisman ki swiv yon endèks, sektè, oswa lòt aktif men ki ka achte ak vann sou yon echanj kòm aksyon."
                : "Obligasyon yo se enstriman dèt kote ou prète lajan ba yon antite (tankou gouvènman oswa yon konpayi) pou yon peryòd tan spesifik an echanj pou peman enterè regilye ak ranbousman prensipal la alafen."
              }
            </p>
            <div className="space-y-2">
              <h4 className="font-medium">Avantaj</h4>
              <ul className="list-disc pl-5 space-y-1">
                {productType === "etf" ? (
                  <>
                    <li>Divèsifikasyon nan yon sèl envestisman</li>
                    <li>Likidite (achte/vann pandan jounen an)</li>
                    <li>Frè ki pi ba pase fon mityèl</li>
                    <li>Efikasite taks</li>
                  </>
                ) : (
                  <>
                    <li>Revni regilye ak previzib</li>
                    <li>Mwens volatil pase aksyon</li>
                    <li>Prezèvasyon kapital</li>
                    <li>Divèsifikasyon pòtfolyo</li>
                  </>
                )}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Risk</h4>
              <ul className="list-disc pl-5 space-y-1">
                {productType === "etf" ? (
                  <>
                    <li>Volatilite mache</li>
                    <li>Risk envestisman (depi nan endèks)</li>
                    <li>Risk likidite (pou kèk ETF)</li>
                  </>
                ) : (
                  <>
                    <li>Risk to enterè (pri obligasyon tonbe lè to enterè monte)</li>
                    <li>Risk enflasyon</li>
                    <li>Risk kredi (posibilite defo peman)</li>
                    <li>Risk likidite</li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Kòman Chwazi</CardTitle>
            <CardDescription>Konsiderasyon kle pou chwazi bon {productType === "etf" ? "ETF" : "Obligasyon"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productType === "etf" ? (
                <>
                  <div className="space-y-2">
                    <h4 className="font-medium">1. Objektif Envestisman</h4>
                    <p>Defini objektif ou yo anvan ou chwazi yon ETF. Èske w ap chèche kwasans, revni, oswa yon konbinezon tou de?</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">2. Frè</h4>
                    <p>Chèche ETF ak frè depans ki ba (0.03% a 0.25% an mwayèn). Frè ki pi ba vle di plis pwofi pou ou.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">3. Endèks ki Swiv</h4>
                    <p>Konprann endèks oswa mache ETF la swiv - S&P 500, NASDAQ, mache emerjan, elatriye.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">4. Likidite</h4>
                    <p>ETF ak volim komèsyal ki pi wo yo gen spreadl pi sere epi pi fasil pou achte/vann.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <h4 className="font-medium">1. Matirite</h4>
                    <p>Obligasyon akoutèm (1-3 ane), mwayèn (3-10 ane), oswa lontèm (10+ ane). Matirite ki pi long ofri rannman ki pi wo men risk to enterè ki pi wo.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">2. Kalite Obligasyon</h4>
                    <p>Obligasyon gouvènman (pi sekirize, rannman pi ba), minisipal (avantaj taks), kòporatif (rannman potansyèl ki pi wo, risk pi wo).</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">3. Klasman Kredi</h4>
                    <p>Kalite envestisman (AAA a BBB-) oswa obligasyon fatra (BB+ a D). Klasman ki pi ba ofri rannman ki pi wo men risk ki pi wo.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">4. Rannman</h4>
                    <p>Rannman reprezante pousantaj retou anyèl yon obligasyon ofri. Konpare rannman nan tout matirite ak klasman kredi.</p>
                  </div>
                </>
              )}
            </div>
            <div className="pt-2 border-t">
              <h4 className="font-medium mb-2">Konsèy pou nouvo envestisè</h4>
              <p>
                {productType === "etf" 
                  ? "Kòmanse ak ETF endèks laj tankou VTI oswa VOO ki bay ekspozisyon nan mache Etazini an. Kenbe frè depans ba epi konsidere yon apwòch acha regilye pou diminye enpak volatilite mache."
                  : "Kòmanse ak yon melanj obligasyon akoutèm ak mwayen ki gen kalite envestisman (BBB oswa pi wo). Konsidere ETF obligasyon kòm yon adrès fasil pou jwenn aksè nan yon pòtfolyo obligasyon divèsifye."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ETFBonds;
