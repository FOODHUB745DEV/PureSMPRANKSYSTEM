
"use client"

import * as React from "react"
import Image from "next/image"
import { Hammer, Zap, Github, Beaker, Loader2, Check, Copy, Ticket, ShieldCheck, X } from "lucide-react"
import { RankCard } from "@/components/shop/RankCard"
import { PlayerAuth } from "@/components/shop/PlayerAuth"
import { SloganGenerator } from "@/components/shop/SloganGenerator"
import { DonorWall } from "@/components/shop/DonorWall"
import { CheckoutDialog } from "@/components/shop/CheckoutDialog"
import { createRankCodeAction } from "@/app/actions/rank-codes"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function Home() {
  const [playerUsername, setPlayerUsername] = React.useState("")
  const [checkoutOpen, setCheckoutOpen] = React.useState(false)
  const [isTestLoading, setIsTestLoading] = React.useState(false)
  const [testResultCode, setTestResultCode] = React.useState<string | null>(null)
  const { toast } = useToast()

  const handlePurchase = () => {
    if (!playerUsername) {
      toast({
        title: "Username fehlt",
        description: "Bitte gib zuerst deinen Minecraft-Namen ein.",
        variant: "destructive"
      })
      const element = document.getElementById('player-auth')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
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
      const generatedCode = await createRankCodeAction(playerUsername, "Pure")
      setTestResultCode(generatedCode)
      toast({
        title: "Test erfolgreich!",
        description: `Aktivierungscode generiert: ${generatedCode}`,
      })
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Test fehlgeschlagen",
        description: "Ein Fehler ist bei der Code-Generierung aufgetreten.",
      })
    } finally {
      setIsTestLoading(false)
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Kopiert!",
      description: "Code in Zwischenablage gespeichert.",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
              <div className="hidden sm:flex items-center gap-2 bg-secondary/50 px-4 py-1.5 rounded-full border border-white/5">
                <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                  Shop Online
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
            <Zap className="h-3 w-3" /> PURE SMP RANK SHOP
          </div>
          <h1 className="text-5xl lg:text-8xl font-headline font-bold tracking-tighter mb-6 leading-none animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            SCHMIEDE DEIN<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[gradient_8s_linear_infinite]">SCHICKSAL.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Erhebe dich über die Massen und sichere dir exklusive Vorteile auf dem Pure SMP Server. Erhalte einen Code und löse ihn sofort ingame ein.
          </p>
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
                  Aktivierungscode testen
                </Button>
                <p className="text-[10px] text-muted-foreground mt-2 text-center italic">
                  Username: {playerUsername || "Keiner gesetzt"}
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
                Offizieller Shop für Pure SMP
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

      {/* Checkout Dialog for normal purchase */}
      <CheckoutDialog 
        open={checkoutOpen} 
        onOpenChange={setCheckoutOpen} 
        username={playerUsername}
      />

      {/* Test Result Dialog for big code display */}
      <Dialog open={!!testResultCode} onOpenChange={(open) => !open && setTestResultCode(null)}>
        <DialogContent className="sm:max-w-[500px] bg-card border-4 border-primary shadow-[0_0_50px_rgba(243,147,75,0.3)] p-0 overflow-hidden">
          <div className="p-8 text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="mx-auto bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center border-4 border-green-500/30">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold tracking-tighter uppercase">Test erfolgreich!</h2>
              <p className="text-muted-foreground">Dein Test-Aktivierungscode:</p>
            </div>
            
            <div className="bg-background border-4 border-primary rounded-2xl p-8 relative shadow-[0_0_30px_rgba(243,147,75,0.2)] group overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
              <Ticket className="absolute -top-4 -right-4 h-16 w-16 text-primary/10 -rotate-12" />
              
              <div className="relative z-10 space-y-4">
                <span className="text-6xl md:text-7xl font-mono font-black tracking-[0.15em] text-primary drop-shadow-[0_0_15px_rgba(243,147,75,0.5)]">
                  {testResultCode}
                </span>
                
                <div className="pt-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => testResultCode && copyCode(testResultCode)} 
                    className="h-12 px-8 font-bold text-lg hover:bg-primary hover:text-primary-foreground transition-all group/btn"
                  >
                    <Copy className="mr-2 h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                    CODE KOPIEREN
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-left text-sm space-y-4 bg-secondary/50 p-6 rounded-xl border border-border">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <p className="font-bold uppercase tracking-wider">Entwickler-Info</p>
              </div>
              <p className="text-muted-foreground">Dieser Code wurde aus deiner <span className="text-foreground font-bold">codes.json</span> Liste gezogen und in Firestore als "benutzt" markiert.</p>
            </div>

            <Button variant="ghost" onClick={() => setTestResultCode(null)} className="w-full text-muted-foreground hover:text-foreground">
              Test schließen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
