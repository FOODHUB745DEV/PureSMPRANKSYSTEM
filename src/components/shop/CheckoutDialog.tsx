
"use client"

import * as React from "react"
import { ShieldCheck, Lock, CreditCard, ChevronRight } from "lucide-react"
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

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
}

export function CheckoutDialog({ open, onOpenChange, username }: CheckoutDialogProps) {
  const [isProcessing, setIsProcessing] = React.useState(false)
  const { toast } = useToast()

  const handleCheckout = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onOpenChange(false)
      toast({
        title: "Kauf Erfolgreich!",
        description: `Der Pure Rang wurde für ${username} freigeschaltet.`,
      })
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-2 border-primary/30">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-2">
            <Lock className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Sicherer Checkout</span>
          </div>
          <DialogTitle className="text-2xl font-headline">Bestellung abschließen</DialogTitle>
          <DialogDescription>
            Du erwirbst den <span className="text-primary font-bold">Pure Rang</span> für den Account <span className="text-foreground font-bold">{username}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg border border-border">
            <div className="flex flex-col">
              <span className="text-sm font-bold">Pure Rang (Lifetime)</span>
              <span className="text-xs text-muted-foreground">Server: Pure SMP</span>
            </div>
            <span className="text-lg font-headline font-bold">30,00€</span>
          </div>

          <Separator className="bg-border/50" />

          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase">Zahlungsmethode wählen</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-16 flex flex-col gap-1 border-border/50 hover:border-primary">
                <CreditCard className="h-5 w-5" />
                <span className="text-[10px]">Kreditkarte</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-1 border-border/50 hover:border-primary">
                <div className="font-bold text-blue-500 italic">PayPal</div>
                <span className="text-[10px]">Instant Pay</span>
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Abbrechen
          </Button>
          <Button 
            className="flex-1 bg-primary text-primary-foreground font-headline" 
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? "Verarbeite..." : "Jetzt Sicher Bezahlen"}
            {!isProcessing && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </DialogFooter>
        <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-muted-foreground">
          <ShieldCheck className="h-3 w-3" />
          SSL Verschlüsselt & DSGVO Konform
        </div>
      </DialogContent>
    </Dialog>
  )
}
