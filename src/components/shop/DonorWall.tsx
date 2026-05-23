
"use client"

import { Users, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const RECENT_DONORS = [
  { name: "Grumm", amount: "Pure Rang", date: "Vor 2 Std." },
  { name: "Dinnerbone", amount: "Pure Rang", date: "Vor 5 Std." },
  { name: "Notch", amount: "Pure Rang", date: "Gestern" },
  { name: "Steve", amount: "Pure Rang", date: "Vor 2 Tagen" },
]

export function DonorWall() {
  return (
    <Card className="border-2 border-border bg-card/50 backdrop-blur-sm h-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-secondary rounded-lg">
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">Legenden-Wand</CardTitle>
        </div>
        <CardDescription>
          Unsere neuesten Unterstützer der Schmiede.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {RECENT_DONORS.map((donor, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarImage src={`https://picsum.photos/seed/${donor.name}/40/40`} />
                  <AvatarFallback>{donor.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm">{donor.name}</span>
                    <ShieldCheck className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-xs text-primary">{donor.amount}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground">{donor.date}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            Werde Teil der Legenden
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
