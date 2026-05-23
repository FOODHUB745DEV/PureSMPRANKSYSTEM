"use client"

import * as React from "react"
import { Users, ShieldCheck, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"

export function DonorWall() {
  const firestore = useFirestore()
  
  // Wir holen uns die 5 neuesten Käufer aus der Datenbank
  const donorsQuery = React.useMemo(() => {
    if (!firestore) return null
    return query(
      collection(firestore, "rank_codes"),
      orderBy("createdAt", "desc"),
      limit(5)
    )
  }, [firestore])

  const { data: donors, loading } = useCollection(donorsQuery)

  return (
    <Card className="border-2 border-border bg-card/50 backdrop-blur-sm h-full flex flex-col">
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
      <CardContent className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-xs uppercase tracking-widest font-bold">Chronik wird geladen...</p>
          </div>
        ) : donors && donors.length > 0 ? (
          <div className="space-y-4">
            {donors.map((donor: any, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-primary/20">
                    <AvatarImage src={`https://picsum.photos/seed/${donor.username}/40/40`} />
                    <AvatarFallback>{donor.username?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm">{donor.username}</span>
                      <ShieldCheck className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">{donor.rankId} RANG</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground">Vor kurzem</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
            <p className="text-xs text-muted-foreground italic">Noch keine Legenden geschmiedet.</p>
          </div>
        )}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            Werde Teil der Geschichte
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
