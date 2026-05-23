
"use client"

import * as React from "react"
import { ShieldCheck, Lock, CreditCard, ChevronRight, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { grantRankAction } from "@/app/actions/exaroton-actions"
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
      // Simulation der Zahlungsabwicklung beim Provider
      await new Promise(resolve => setTimeout(resolve, 2500))

      // Rufe Server Action auf, um Command auf Exaroton auszuführen
      const success = await grantRankAction(username, "Pure")

      if (success) {
        toast({
          title: "Kauf Erfolgreich!",
          description: `Der Pure Rang wurde für ${username} via ${paymentMethod === 'paypal' ? 'PayPal' : 'Kreditkarte'} freigeschaltet.`,
        })
        onOpenChange(false)
        setPaymentMethod(null)
      } else {
        throw new Error("Command konnte nicht gesendet werden.")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Checkout",
        description: "Die Verbindung zum Server konnte nicht hergestellt werden. Dein Geld wurde nicht abgebucht.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!isProcessing) onOpenChange(val)
    }}>
      <DialogContent className="sm:max-w-[425px] bg-card border-2 border-primary/30">
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
                Zahlung wird verarbeitet...
              </>
            ) : (
              <>
                {paymentMethod ? `Mit ${paymentMethod === 'paypal' ? 'PayPal' : 'Karte'} bezahlen` : "Zahlungsmethode wählen"}
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground opacity-60">
            <ShieldCheck className="h-3 w-3" />
            100% Sicher • Exaroton API Integration aktiv
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
