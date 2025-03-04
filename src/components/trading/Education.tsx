
import { useState } from 'react';
import { Search, BookOpen, Video, FileText, Play, Clock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const Education = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contentType, setContentType] = useState("all");
  
  // Sample educational content
  const educationalContent = [
    {
      id: 1,
      title: "Baz Envestisman nan Mache Aksyon",
      type: "video",
      level: "beginner",
      duration: "15 min",
      views: 1542,
      description: "Aprann konsèp fondamantal yo pou kòmanse envesti nan mache aksyon.",
      tags: ["aksyon", "baz", "debutant"]
    },
    {
      id: 2,
      title: "Kòman Analize Aksyon yo",
      type: "article",
      level: "intermediate",
      duration: "10 min",
      views: 854,
      description: "Gid etap pa etap sou kòman analize aksyon yon konpayi avan ou envesti.",
      tags: ["analiz", "aksyon", "finansye"]
    },
    {
      id: 3,
      title: "Konprann ETF yo",
      type: "video",
      level: "beginner",
      duration: "12 min",
      views: 1256,
      description: "Yon gid sou sa ETF yo ye epi poukisa yo se yon zouti envestisman enpòtan.",
      tags: ["etf", "baz", "divèsifikasyon"]
    },
    {
      id: 4,
      title: "Envestisman nan Obligasyon",
      type: "course",
      level: "intermediate",
      duration: "3 hours",
      views: 632,
      description: "Kou konplè sou fason pou envesti nan obligasyon pou revni ak divèsifikasyon.",
      tags: ["obligasyon", "revni", "risk"]
    },
    {
      id: 5,
      title: "Estrateji Divèsifikasyon Pòtfolyo",
      type: "article",
      level: "intermediate",
      duration: "15 min",
      views: 923,
      description: "Aprann sou fason pou divèsifye pòtfolyo ou pou maksimize retou ak minimize risk.",
      tags: ["divèsifikasyon", "pòtfolyo", "risk"]
    },
    {
      id: 6,
      title: "Endikatè Teknik pou Analiz Mache",
      type: "video",
      level: "advanced",
      duration: "25 min",
      views: 745,
      description: "Aprann kòman itilize endikatè teknik tankou MACD, RSI ak Bollinger Bands.",
      tags: ["teknik", "analiz", "endikatè"]
    }
  ];
  
  // Filter content based on search and type
  const filteredContent = educationalContent.filter(content => {
    const matchesSearch = searchQuery === "" ||
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = contentType === "all" || content.type === contentType;
    
    return matchesSearch && matchesType;
  });
  
  // Sample FAQ data
  const faqData = [
    {
      question: "Ki sa ki yon aksyon?",
      answer: "Yon aksyon se yon tit pwopriyete ki reprezante yon pati nan yon konpayi. Lè ou achte yon aksyon, ou vin yon aktè nan konpayi a, sa ki ba ou dwa pou resevwa dividann ak patisipe nan kwasans konpayi a."
    },
    {
      question: "Ki diferans ant ETF ak fon mityèl?",
      answer: "ETF (Exchange-Traded Funds) ak fon mityèl tou de swiv yon panyen aktif, men ETF yo komès sou echanj stock pandan jounen an, tankou aksyon. Fon mityèl yo sèlman achte oswa vann nan fen jounen an. ETF yo souvan gen tou frè ki pi ba ak pi bon avantaj taks."
    },
    {
      question: "Ki sa ki yon dividann?",
      answer: "Yon dividann se yon pèman ke yon konpayi fè bay aksyonè li yo, anjeneral soti nan pwofi. Yo souvan peye chak trimès oswa chak ane, e yo se yon fason pou konpayi yo pataje siksè finansye yo ak moun ki posede aksyon yo."
    },
    {
      question: "Ki sa P/E ratio vle di?",
      answer: "P/E (Price-to-Earnings) ratio se pri aksyon yon konpayi divize pa revni pa aksyon li. Li ede envestisè yo detèmine si yon aksyon apresye relativman ak revni li. Yon P/E ki wo ka sigjere ke envestisè yo prevwa kwasans ki wo, pandan yon P/E ki ba ka sigjere ke aksyon an sibapresye oswa ke konpayi a ap fè fas a defi."
    },
    {
      question: "Ki sa 'divèsifikasyon' vle di?",
      answer: "Divèsifikasyon se yon estrateji envestisman kote ou repati envestisman ou yo nan diferan klas aktif, sektè, ak rejyon jewografik. Objektif la se pou redwi risk lè ou asire ke tout envestisman ou yo pa afekte nan menm fason pa evènman mache."
    },
    {
      question: "Ki sa ki yon lòd limit?",
      answer: "Yon lòd limit se yon enstriksyon pou achte oswa vann yon aksyon nan yon pri espesifik oswa pi bon. Lòd limit achte yo egzekite nan pri limit la oswa pi ba, pandan ke lòd limit vann yo egzekite nan pri limit la oswa pi wo."
    }
  ];
  
  // Sample investment terms glossary
  const glossaryTerms = [
    { term: "Aksyon", definition: "Yon tit ki reprezante yon pwopriyete nan yon konpayi piblik oswa prive." },
    { term: "Obligasyon", definition: "Yon dèt enstriman kote yon envestisè prete lajan ba yon antite pou yon peryòd fikse ak yon to enterè fikse oswa varyab." },
    { term: "Dividann", definition: "Yon pèman ki fèt pa yon konpayi bay aksyonè li yo, jeneralman kòm yon distribisyon nan pwofi." },
    { term: "ETF", definition: "Exchange-Traded Fund, yon tip fon envestisman ki swiv yon endèks, komodite, oswa panyen aktif men ki komès tankou yon aksyon." },
    { term: "P/E Ratio", definition: "Price-to-Earnings Ratio, yon mezi valorasyon ki kalkile kòm pri mache pa aksyon divize pa revni pa aksyon." },
    { term: "Volatilite", definition: "Yon mezi statistik sou dispèsyon retou pou yon aktif oswa endèks, souvan itilize kòm yon mezi risk." },
    { term: "Kapitalizasyon Mache", definition: "Valè total dola tout aksyon ki deyò nan yon konpayi, kalkile kòm pri aksyon a miltipliye pa nimewo aksyon ki deyò." },
    { term: "Divèsifikasyon", definition: "Yon estrateji ki melanje yon gran varyete envestisman nan yon pòtfolyo pou redwi ekspozisyon a nenpòt youn nan envestisman yo." }
  ];
  
  // Content type icons
  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'course':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  // Get badge color based on level
  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 'beginner':
        return "bg-green-100 text-green-800";
      case 'intermediate':
        return "bg-blue-100 text-blue-800";
      case 'advanced':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sant Edikasyon</CardTitle>
          <CardDescription>Aprann sou envestisman, aksyon, obligasyon ak plis ankò</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chèche kontni edikasyon..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs value={contentType} onValueChange={setContentType} className="flex-1">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tout</TabsTrigger>
                <TabsTrigger value="video">Videyo</TabsTrigger>
                <TabsTrigger value="article">Atik</TabsTrigger>
                <TabsTrigger value="course">Kou</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">Pa gen rezilta ki koresponn ak rechèch ou.</p>
              </div>
            ) : (
              filteredContent.map((content) => (
                <Card key={content.id} className="overflow-hidden">
                  <div className="relative bg-slate-100 h-36 flex items-center justify-center">
                    {getContentTypeIcon(content.type)}
                    {content.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 rounded-full p-2">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className={getLevelBadgeColor(content.level)}>
                        {content.level === 'beginner' ? 'Debittan' : 
                         content.level === 'intermediate' ? 'Entèmedyè' : 'Avanse'}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {content.duration}
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{content.title}</CardTitle>
                    <CardDescription>{content.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-1">
                      {content.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-muted px-2 py-1 rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <span className="text-sm text-muted-foreground">{content.views} lektè</span>
                    <Button size="sm">
                      {content.type === 'video' ? 'Gade Videyo' : 
                       content.type === 'article' ? 'Li Atik' : 'Kòmanse Kou'}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kesyon Moun Poze Souvan</CardTitle>
            <CardDescription>Repons pou kesyon komen sou envestisman</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Glosè Tèm Envestisman</CardTitle>
            <CardDescription>Definisyon tèm kle nan lemonn envestisman ak finans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {glossaryTerms.map((item, index) => (
                <div key={index} className="border-b pb-2 last:border-0">
                  <h4 className="font-medium">{item.term}</h4>
                  <p className="text-sm text-muted-foreground">{item.definition}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Similasyon Envestisman</CardTitle>
          <CardDescription>Pratike konpetans envestisman ou san ou pa riske lajan reyèl</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 border rounded-lg">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Kont Similasyon</h3>
            <p className="max-w-md mx-auto mb-6 text-muted-foreground">
              Itilize kont similasyon nou an pou pratike achte ak vann aksyon nan yon anviwònman san risk.
              Kòmanse ak $100,000 lajan vityèl epi aprann estrateji envestisman yo.
            </p>
            <Button>Kòmanse Similasyon</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Education;
