
"use client"

import * as React from "react"
import { Sparkles, Copy, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { generateRankSlogans } from "@/ai/flows/generate-rank-slogans"
import { useToast } from "@/hooks/use-toast"

export function SloganGenerator() {
  const [slogans, setSlogans] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const result = await generateRankSlogans({
        rankName: "Pure",
        price: "30,00 Euro",
        benefits: "Flugmodus, Enderchest-Zugriff, Goldener Name, Exklusive Kits, Schmiede-Boni",
        targetAudience: "Minecraft Spieler auf Pure SMP",
        styleTone: "episch, feurig, motivierend",
        numSlogans: 3
      })
      setSlogans(result.slogans)
    } catch (error) {
      toast({
        title: "Fehler beim Generieren",
        description: "Die KI-Schmiede ist gerade überhitzt. Bitte versuch es gleich nochmal.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Kopiert!",
      description: "Der Slogan wurde in deine Zwischenablage kopiert.",
    })
  }

  return (
    <Card className="border-2 border-accent/20 bg-card/50 backdrop-blur-sm glow-hover">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <CardTitle className="text-xl">KI Slogan-Schmiede</CardTitle>
        </div>
        <CardDescription>
          Generiere epische Ankündigungen für deinen Kauf.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {slogans.length > 0 ? (
          <div className="space-y-3">
            {slogans.map((slogan, idx) => (
              <div 
                key={idx} 
                className="group relative p-3 bg-background/50 border border-border rounded-md hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => copyToClipboard(slogan)}
              >
                <p className="text-sm italic leading-relaxed pr-8">"{slogan}"</p>
                <Copy className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
            <Button 
              variant="outline" 
              onClick={handleGenerate} 
              disabled={loading}
              className="w-full border-accent/50 text-accent hover:bg-accent/10"
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Neue Slogans schmieden
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 font-headline"
          >
            <Sparkles className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Wird geschmiedet..." : "Epische Slogans generieren"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
