
"use client"

import { Check, Flame, Star, Shield, Zap, Hammer, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const PERKS = [
  { icon: <Star className="h-4 w-4" />, text: "Goldener Präfix & Tab-Name" },
  { icon: <Flame className="h-4 w-4" />, text: "Flugmodus in Lobbies" },
  { icon: <Zap className="h-4 w-4" />, text: "Zugriff auf /workbench & /enderchest" },
  { icon: <Shield className="h-4 w-4" />, text: "50x Home-Punkte setzen" },
  { icon: <Hammer className="h-4 w-4" />, text: "Exklusive Schmiede-Kits" },
]

interface RankCardProps {
  onPurchase: () => void;
  disabled?: boolean;
}

export function RankCard({ onPurchase, disabled }: RankCardProps) {
  return (
    <Card className="relative overflow-hidden border-2 border-primary glow-hover bg-card/80 flex flex-col h-full">
      <div className="absolute top-0 right-0 p-4">
        <Badge variant="default" className="bg-accent hover:bg-accent/80 animate-pulse text-white px-3 py-1">
          MEISTVERKAUFT
        </Badge>
      </div>
      
      <CardHeader className="text-center pt-10">
        <div className="mx-auto bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mb-4 border-2 border-primary/50 shadow-[0_0_20px_rgba(243,147,75,0.2)]">
          <Flame className="h-10 w-10 text-primary animate-bounce" />
        </div>
        <CardTitle className="text-4xl font-headline tracking-tighter uppercase">Pure Rang</CardTitle>
        <CardDescription className="text-primary font-bold text-lg mt-2">
          Lebenslange Mitgliedschaft
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 px-8">
        <div className="space-y-4 my-6">
          {PERKS.map((perk, idx) => (
            <div key={idx} className="flex items-start gap-3 group">
              <div className="mt-1 text-primary group-hover:scale-110 transition-transform">
                {perk.icon}
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {perk.text}
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 p-8 bg-secondary/50 border-t border-border/50">
        <div className="text-center w-full">
          <div className="flex items-center justify-center gap-2">
            <Coins className="h-8 w-8 text-primary" />
            <span className="text-4xl font-headline font-bold">3.000</span>
          </div>
          <span className="text-muted-foreground text-sm block">Robux • Einmalig</span>
        </div>
        <Button 
          onClick={onPurchase}
          disabled={disabled}
          className="w-full py-6 text-lg font-headline tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all"
        >
          JETZT ERWERBEN
        </Button>
        <p className="text-[10px] text-muted-foreground text-center italic">
          Mit dem Kauf unterstützt du den Erhalt von Pure SMP.
        </p>
      </CardFooter>
    </Card>
  )
}
