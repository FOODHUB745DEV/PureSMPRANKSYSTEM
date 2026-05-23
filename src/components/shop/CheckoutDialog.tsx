
"use client"

import * as React from "react"
import { ShieldCheck, Lock, CreditCard, ChevronRight, Loader2, Check, Copy, Ticket } from "lucide-react"
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

type PaymentMethod = "card" | "paypal" | null

export function CheckoutDialog({ open, onOpenChange, username }: CheckoutDialogProps) {
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>(null)
  const [generatedCode, setGeneratedCode] = React.useState<string | null>(null)
  const { toast } = useToast()

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast({
        variant: "destructive",
        title: "Zahlungsmethode fehlt",
        description: "Bitte wähle PayPal oder Kreditkarte aus.",
      })
      return
    }

    setIsProcessing(true)
    
    try {
      // Simulation der Zahlungsabwicklung
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generiere Code in Firestore
      const code = await createRankCodeAction(username, "Pure")
      setGeneratedCode(code)

      toast({
        title: "Kauf Erfolgreich!",
        description: "Dein Aktivierungscode wurde generiert.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Checkout",
        description: "Der Code konnte nicht generiert werden. Bitte kontaktiere den Support.",
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
      setPaymentMethod(null)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!isProcessing) resetAndClose()
    }}>
      <DialogContent className="sm:max-w-[425px] bg-card border-2 border-primary/30">
        {!generatedCode ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Lock className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Sicherer Checkout (AES-256)</span>
              </div>
              <DialogTitle className="text-2xl font-headline">Zahlung abschließen</DialogTitle>
              <DialogDescription>
                Account: <span className="text-foreground font-bold">{username}</span> • Produkt: <span className="text-primary font-bold">Pure Rang</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-6">
              <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-lg border border-border">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Gesamtbetrag</span>
                  <span className="text-xs text-muted-foreground italic">Inkl. MwSt.</span>
                </div>
                <span className="text-2xl font-headline font-bold text-primary">30,00€</span>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Wähle deine Zahlungsmethode</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaymentMethod("card")}
                    disabled={isProcessing}
                    className={cn(
                      "relative h-20 flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all",
                      paymentMethod === "card" 
                        ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(243,147,75,0.2)]" 
                        : "border-border/50 hover:border-primary/50 bg-secondary/20"
                    )}
                  >
                    {paymentMethod === "card" && <div className="absolute top-1 right-1"><Check className="h-3 w-3 text-primary" /></div>}
                    <CreditCard className={cn("h-6 w-6", paymentMethod === "card" ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-[10px] font-bold">Kreditkarte</span>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod("paypal")}
                    disabled={isProcessing}
                    className={cn(
                      "relative h-20 flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all",
                      paymentMethod === "paypal" 
                        ? "border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                        : "border-border/50 hover:border-blue-400/50 bg-secondary/20"
                    )}
                  >
                    {paymentMethod === "paypal" && <div className="absolute top-1 right-1"><Check className="h-3 w-3 text-blue-500" /></div>}
                    <div className="font-black text-blue-500 italic text-sm tracking-tighter">PayPal</div>
                    <span className="text-[10px] font-bold">Instant Pay</span>
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-3">
              <Button 
                className="w-full h-12 bg-primary text-primary-foreground font-headline text-md hover:scale-[1.02] active:scale-95 transition-all shadow-lg" 
                onClick={handleCheckout}
                disabled={isProcessing || !paymentMethod}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verarbeite...
                  </>
                ) : (
                  <>
                    Zahlungspflichtig bestellen
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center space-y-6">
            <div className="mx-auto bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center border-2 border-green-500/20">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-headline font-bold">Vielen Dank!</h2>
              <p className="text-sm text-muted-foreground">Dein Rang ist bereit zur Aktivierung.</p>
            </div>
            
            <div className="bg-secondary/50 border-2 border-dashed border-primary/40 p-6 rounded-xl relative group">
              <Ticket className="absolute -top-3 -left-3 h-8 w-8 text-primary/40 -rotate-12" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-2">Dein Aktivierungscode</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-mono font-bold tracking-[0.2em] text-primary">{generatedCode}</span>
                <Button size="icon" variant="ghost" onClick={copyCode} className="h-8 w-8 hover:bg-primary/20">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-left text-xs space-y-3 bg-primary/5 p-4 rounded-lg border border-primary/10">
              <p className="font-bold text-primary">Nächste Schritte:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Logge dich auf <span className="text-foreground font-medium">Pure SMP</span> ein.</li>
                <li>Nutze den Befehl: <code className="bg-background px-1.5 py-0.5 rounded border">/redeem {generatedCode}</code></li>
                <li>Dein Rang wird sofort aktiviert!</li>
              </ol>
            </div>

            <Button variant="outline" onClick={resetAndClose} className="w-full">
              Fenster schließen
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
