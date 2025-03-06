
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LineChart, BarChart, PieChart, Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { FileDown, FileText, Filter, Calendar } from "lucide-react";

export const AdminReports = () => {
  const [dateRange, setDateRange] = useState('month');
  
  // Mock data for demonstration
  const monthlyRevenueData = [
    { name: 'Janvye', total: 12400 },
    { name: 'Fevriye', total: 15600 },
    { name: 'Mas', total: 14200 },
    { name: 'Avril', total: 18100 },
    { name: 'Me', total: 21300 },
    { name: 'Jen', total: 19800 },
  ];
  
  const userActivityData = [
    { name: 'Banque', users: 3200 },
    { name: 'Kredi', users: 1800 },
    { name: 'Trading', users: 2100 },
    { name: 'Jeu', users: 2600 },
  ];
  
  const transactionData = [
    { name: 'Depo', value: 45 },
    { name: 'Retrè', value: 30 },
    { name: 'Transfè', value: 20 },
    { name: 'Prè', value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // List of available reports
  const availableReports = [
    { id: 'R001', name: 'Rapò Revni Chak Mwa', category: 'Finance', lastGenerated: '2023-10-10' },
    { id: 'R002', name: 'Aktivite Itilizatè pa Kategori', category: 'Itilizatè', lastGenerated: '2023-10-12' },
    { id: 'R003', name: 'Distribisyon Tranzaksyon', category: 'Tranzaksyon', lastGenerated: '2023-10-15' },
    { id: 'R004', name: 'Pèfòmans Kazino', category: 'Jeu', lastGenerated: '2023-10-14' },
    { id: 'R005', name: 'Analiz Prè ak Risk', category: 'Finance', lastGenerated: '2023-10-11' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Rapò & Analiz</h2>
          <p className="text-finance-charcoal/70 dark:text-white/70">
            Jenere rapò detaye sou pèfòmans platfòm nan
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <SelectValue placeholder="Peryòd" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semèn sa</SelectItem>
              <SelectItem value="month">Mwa sa</SelectItem>
              <SelectItem value="quarter">Trimès sa</SelectItem>
              <SelectItem value="year">Ane sa</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            <span>Ekspòte</span>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Itilizatè</CardTitle>
            <CardDescription>Itilizatè aktif sou platfòm nan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">9,721</div>
            <p className="text-xs text-green-600">+12.5% depi mwa pase</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Volim Tranzaksyon</CardTitle>
            <CardDescription>Total valè tranzaksyon yo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$1.2M</div>
            <p className="text-xs text-green-600">+8.3% depi mwa pase</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revni Sistem</CardTitle>
            <CardDescription>Pwofi total platfòm nan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$142K</div>
            <p className="text-xs text-green-600">+15.7% depi mwa pase</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="financial">
        <TabsList>
          <TabsTrigger value="financial">Rapò Finansye</TabsTrigger>
          <TabsTrigger value="users">Analiz Itilizatè</TabsTrigger>
          <TabsTrigger value="gaming">Pèfòmans Jeu</TabsTrigger>
          <TabsTrigger value="list">Lis Rapò</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Revni Chak Mwa</CardTitle>
              <CardDescription>Evolisyon revni platfòm nan sou peryòd la</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyRevenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Total']} />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} name="Revni" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtre</span>
              </Button>
              <Button className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                <span>Ekspòte Rapò</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Aktivite Itilizatè pa Kategori</CardTitle>
              <CardDescription>Kantite itilizatè aktif nan chak seksyon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userActivityData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill="#82ca9d" name="Itilizatè Aktif" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtre</span>
              </Button>
              <Button className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                <span>Ekspòte Rapò</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="gaming" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribisyon Tranzaksyon</CardTitle>
              <CardDescription>Pousantaj chak tip tranzaksyon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {transactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtre</span>
              </Button>
              <Button className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                <span>Ekspòte Rapò</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lis Rapò Disponib</CardTitle>
              <CardDescription>Tout rapò ki ka jenere sou sistèm nan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableReports.map(report => (
                  <div key={report.id} className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <span className="font-semibold">{report.name}</span>
                        </div>
                        <div className="flex gap-4 mt-1">
                          <span className="text-xs text-finance-charcoal/70 dark:text-white/70">
                            ID: {report.id}
                          </span>
                          <span className="text-xs text-finance-charcoal/70 dark:text-white/70">
                            Kategori: {report.category}
                          </span>
                          <span className="text-xs text-finance-charcoal/70 dark:text-white/70">
                            Dènye Jenere: {report.lastGenerated}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Aprè</Button>
                        <Button size="sm">Jenere</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
