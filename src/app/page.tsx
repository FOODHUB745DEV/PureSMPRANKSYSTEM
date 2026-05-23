
"use client"

import * as React from "react"
import Image from "next/image"
import { Hammer, Sword, Zap, Github, Server, Beaker, Loader2 } from "lucide-react"
import { RankCard } from "@/components/shop/RankCard"
import { PlayerAuth } from "@/components/shop/PlayerAuth"
import { SloganGenerator } from "@/components/shop/SloganGenerator"
import { DonorWall } from "@/components/shop/DonorWall"
import { CheckoutDialog } from "@/components/shop/CheckoutDialog"
import { fetchServerStatusAction, grantRankAction } from "@/app/actions/exaroton-actions"
import { type ExarotonServerStatus } from "@/lib/exaroton"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function Home() {
  const [playerUsername, setPlayerUsername] = React.useState("")
  const [checkoutOpen, setCheckoutOpen] = React.useState(false)
  const [serverStatus, setServerStatus] = React.useState<ExarotonServerStatus | null>(null)
  const [isTestLoading, setIsTestLoading] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    const getStatus = async () => {
      const status = await fetchServerStatusAction()
      setServerStatus(status)
    }
    getStatus()

    const interval = setInterval(getStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const handlePurchase = () => {
    if (!playerUsername) {
      toast({
        title: "Username fehlt",
        description: "Bitte gib zuerst deinen Minecraft-Namen ein.",
        variant: "destructive"
      })
      document.getElementById('player-auth')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    setCheckoutOpen(true)
  }

  const handleDevTestRank = async () => {
    if (!playerUsername) {
      toast({
        title: "Test fehlgeschlagen",
        description: "Gib erst einen Usernamen oben ein!",
        variant: "destructive"
      })
      return
    }

    setIsTestLoading(true)
    try {
      const success = await grantRankAction(playerUsername, "Pure")
      if (success) {
        toast({
          title: "Test erfolgreich!",
          description: `Befehl für ${playerUsername} wurde an Exaroton gesendet.`,
        })
      } else {
        throw new Error("API Fehler")
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Test fehlgeschlagen",
        description: "Prüfe die Server-Konsole oder API-Daten.",
      })
    } finally {
      setIsTestLoading(false)
    }
  }

  const isServerOnline = serverStatus?.status === 1

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative p-2 bg-primary/10 rounded-lg border border-primary/20">
                  <Hammer className="h-6 w-6 text-primary" />
                </div>
              </div>
              <span className="font-headline text-2xl tracking-tighter font-bold">
                PURE<span className="text-primary italic">FORGE</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Startseite</a>
              <a href="#" className="hover:text-primary transition-colors">Regeln</a>
              <a href="#" className="hover:text-primary transition-colors">Discord</a>
              <a href="#" className="hover:text-primary transition-colors">Team</a>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-white/5">
                <div className={`w-2 h-2 rounded-full ${isServerOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                  {serverStatus ? `${serverStatus.players.count} Spieler Online` : 'Server Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/forge1/1200/600" 
            alt="Pure SMP Forge" 
            fill
            className="object-cover opacity-20 grayscale scale-110"
            priority
            data-ai-hint="minecraft landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Server className="h-3 w-3" /> {serverStatus?.address || "EXAROTON SERVER"}
          </div>
          <h1 className="text-5xl lg:text-8xl font-headline font-bold tracking-tighter mb-6 leading-none animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            SCHMIEDE DEIN<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[gradient_8s_linear_infinite]">SCHICKSAL.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Erhebe dich über die Massen und sichere dir exklusive Vorteile auf dem {serverStatus?.name || "Pure SMP"} Server. 
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span>Echtzeit-Verbindung</span>
            </div>
            <div className="w-1 h-1 bg-muted rounded-full self-center"></div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span>Exaroton Cloud</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Bento Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-8 h-full flex flex-col">
            <div id="player-auth">
              <PlayerAuth onValidated={(user) => setPlayerUsername(user)} />
            </div>
            
            {/* Dev Test Tool */}
            <Card className="border-2 border-dashed border-primary/40 bg-primary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Beaker className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-widest">Developer Tools</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full border-primary/50 text-primary hover:bg-primary/10"
                  onClick={handleDevTestRank}
                  disabled={isTestLoading}
                >
                  {isTestLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Rang Ingame vergeben (Test)
                </Button>
                <p className="text-[10px] text-muted-foreground mt-2 text-center italic">
                  Nutzt den Usernamen: {playerUsername || "Keiner gesetzt"}
                </p>
              </CardContent>
            </Card>

            <div className="flex-1">
              <DonorWall />
            </div>
            <SloganGenerator />
          </div>
          <div className="lg:col-span-8 h-full">
            <RankCard 
              onPurchase={handlePurchase} 
              disabled={false}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5 bg-secondary/20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2 items-center md:items-start">
              <span className="font-headline text-xl font-bold tracking-tighter">
                PURE<span className="text-primary">FORGE</span>
              </span>
              <p className="text-[10px] text-muted-foreground max-w-xs text-center md:text-left uppercase tracking-widest leading-relaxed">
                Server IP: {serverStatus?.address || "offline"}
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="p-2 hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
            </div>
            <div className="text-xs text-muted-foreground flex flex-col md:flex-row gap-4 md:gap-8 items-center">
              <span className="opacity-50">© 2024 Pure SMP Server</span>
            </div>
          </div>
        </div>
      </footer>

      <CheckoutDialog 
        open={checkoutOpen} 
        onOpenChange={setCheckoutOpen} 
        username={playerUsername}
      />
    </div>
  )
}
