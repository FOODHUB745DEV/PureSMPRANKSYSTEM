
"use client"

import * as React from "react"
import { ShieldCheck, Lock, ChevronRight, Loader2, Check, Copy, Ticket, Coins, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { createRankCodeAction } from "@/app/actions/rank-codes"
import { cn } from "@/lib/utils"

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
}

export function CheckoutDialog({ open, onOpenChange, username }: CheckoutDialogProps) {
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [generatedCode, setGeneratedCode] = React.useState<string | null>(null)
  const { toast } = useToast()

  const ROBLOX_GAME_URL = "https://www.roblox.com/de/games/137404764079367/PureSMP-Rang-Kauf-Center"

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    try {
      // Simulation der Verifizierung (da wir keine API-Anbindung an Roblox-Käufe haben, 
      // vertrauen wir hier auf die Bestätigung des Nutzers nach dem Spielbesuch)
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Generiere Code in Firestore
      const code = await createRankCodeAction(username, "Pure")
      setGeneratedCode(code)

      toast({
        title: "Vielen Dank!",
        description: "Dein Aktivierungscode wurde erfolgreich geschmiedet.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Checkout",
        description: "Der Code konnte nicht generiert werden. Bitte versuche es erneut.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      toast({
        title: "Kopiert!",
        description: "Code in Zwischenablage gespeichert.",
      })
    }
  }

  const resetAndClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setGeneratedCode(null)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!isProcessing) resetAndClose()
    }}>
      <DialogContent className="sm:max-w-[500px] bg-card border-4 border-primary shadow-[0_0_50px_rgba(243,147,75,0.3)]">
        {!generatedCode ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Lock className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Roblox-Transaktion</span>
              </div>
              <DialogTitle className="text-2xl font-headline">Zahlung im Kauf-Center</DialogTitle>
              <DialogDescription>
                Account: <span className="text-foreground font-bold">{username}</span> • Produkt: <span className="text-primary font-bold">Pure Rang</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-6">
              <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-lg border border-border">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Preis</span>
                  <span className="text-xs text-muted-foreground italic">Zahlbar im Roblox Center</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-headline font-bold text-primary">3.000</span>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Schritt 1: Im Center bezahlen</p>
                <p className="text-sm text-muted-foreground">Besuche unser Roblox Kauf-Center und erwerbe dort den Rang. Kehre danach hierher zurück.</p>
                <Button 
                  asChild
                  variant="outline" 
                  className="w-full border-primary/50 text-primary hover:bg-primary/10 gap-2 h-12"
                >
                  <a href={ROBLOX_GAME_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    ZUM KAUF-CENTER (ROBLOX)
                  </a>
                </Button>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">Schritt 2: Code abholen</p>
                <p className="text-[10px] text-center text-muted-foreground italic">Sobald du im Roblox Spiel bezahlt hast, klicke hier auf Bestätigen.</p>
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-3">
              <Button 
                className="w-full h-12 bg-primary text-primary-foreground font-headline text-md hover:scale-[1.02] active:scale-95 transition-all shadow-lg" 
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generiere Code...
                  </>
                ) : (
                  <>
                    Zahlung erfolgt? Code anfordern
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="mx-auto bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center border-4 border-green-500/30">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold tracking-tighter uppercase">Code erhalten!</h2>
              <p className="text-muted-foreground">Dein Aktivierungscode wurde geschmiedet:</p>
            </div>
            
            <div className="bg-background border-4 border-primary rounded-2xl p-8 relative shadow-[0_0_30px_rgba(243,147,75,0.2)] group overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
              <Ticket className="absolute -top-4 -right-4 h-16 w-16 text-primary/10 -rotate-12" />
              
              <div className="relative z-10 space-y-4">
                <span className="text-6xl md:text-7xl font-mono font-black tracking-[0.15em] text-primary drop-shadow-[0_0_15px_rgba(243,147,75,0.5)]">
                  {generatedCode}
                </span>
                
                <div className="pt-4">
                  <Button 
                    variant="secondary" 
                    onClick={copyCode} 
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
                <p className="font-bold uppercase tracking-wider">Aktivierungs-Anleitung</p>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground font-medium">
                <li>Verbinde dich mit dem <span className="text-foreground font-bold underline decoration-primary">Pure SMP</span> Server.</li>
                <li>Öffne den Chat und gib folgendes ein:</li>
                <li className="bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-primary text-center select-all">
                  /redeem {generatedCode}
                </li>
                <li>Dein Rang wird <span className="text-foreground font-bold">SOFORT</span> freigeschaltet!</li>
              </ol>
            </div>

            <Button variant="ghost" onClick={resetAndClose} className="w-full text-muted-foreground hover:text-foreground">
              Fenster schließen
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
