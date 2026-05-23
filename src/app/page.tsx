
"use client"

import * as React from "react"
import Image from "next/image"
import { Hammer, Sword, Zap, Github } from "lucide-react"
import { RankCard } from "@/components/shop/RankCard"
import { PlayerAuth } from "@/components/shop/PlayerAuth"
import { SloganGenerator } from "@/components/shop/SloganGenerator"
import { DonorWall } from "@/components/shop/DonorWall"
import { CheckoutDialog } from "@/components/shop/CheckoutDialog"

export default function Home() {
  const [playerUsername, setPlayerUsername] = React.useState("")
  const [checkoutOpen, setCheckoutOpen] = React.useState(false)

  const handlePurchase = () => {
    if (!playerUsername) {
      // Small visual nudge if they haven't validated
      document.getElementById('player-auth')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    setCheckoutOpen(true)
  }

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
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                  128 Spieler Online
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
            <Sword className="h-3 w-3" /> Offizieller Pure SMP Shop
          </div>
          <h1 className="text-5xl lg:text-8xl font-headline font-bold tracking-tighter mb-6 leading-none animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            SCHMIEDE DEIN<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[gradient_8s_linear_infinite]">SCHICKSAL.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Erhebe dich über die Massen und sichere dir exklusive Vorteile auf dem Pure SMP Server. 
            Jeder Kauf unterstützt unsere Community und die Weiterentwicklung neuer Features.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span>Sofortige Freischaltung</span>
            </div>
            <div className="w-1 h-1 bg-muted rounded-full self-center"></div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span>Lifetime Zugriff</span>
            </div>
            <div className="w-1 h-1 bg-muted rounded-full self-center"></div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span>Sichere Bezahlung</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Bento Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Auth & AI & Wall */}
          <div className="lg:col-span-4 space-y-8 h-full flex flex-col">
            <div id="player-auth">
              <PlayerAuth onValidated={(user) => setPlayerUsername(user)} />
            </div>
            
            <div className="flex-1">
              <DonorWall />
            </div>

            <SloganGenerator />
          </div>

          {/* Right Column - The Pure Rank (Bento Style Emphasis) */}
          <div className="lg:col-span-8 h-full">
            <RankCard 
              onPurchase={handlePurchase} 
              disabled={false}
            />
          </div>

        </div>

        {/* Community Info Section */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-secondary/20 border border-white/5 hover:border-primary/20 transition-all text-center">
            <h3 className="text-xl font-headline font-bold mb-4">Gemeinschaft</h3>
            <p className="text-sm text-muted-foreground">Wir sind mehr als nur ein Server. Wir sind eine Familie von Entdeckern und Kriegern.</p>
          </div>
          <div className="p-8 rounded-2xl bg-secondary/20 border border-white/5 hover:border-primary/20 transition-all text-center">
            <h3 className="text-xl font-headline font-bold mb-4">Innovation</h3>
            <p className="text-sm text-muted-foreground">Eigene Plugins und Mechaniken, die du sonst nirgendwo finden wirst.</p>
          </div>
          <div className="p-8 rounded-2xl bg-secondary/20 border border-white/5 hover:border-primary/20 transition-all text-center">
            <h3 className="text-xl font-headline font-bold mb-4">Support</h3>
            <p className="text-sm text-muted-foreground">Unser Team steht dir rund um die Uhr zur Verfügung, falls Probleme auftreten.</p>
          </div>
        </section>
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
                Wir stehen in keiner Verbindung zu Mojang AB oder Microsoft. Minecraft ist ein Markenzeichen von Mojang AB.
              </p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="p-2 hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
              {/* Other social icons could go here */}
            </div>

            <div className="text-xs text-muted-foreground flex flex-col md:flex-row gap-4 md:gap-8 items-center">
              <a href="#" className="hover:text-foreground">Impressum</a>
              <a href="#" className="hover:text-foreground">Datenschutz</a>
              <a href="#" className="hover:text-foreground">AGB</a>
              <span className="opacity-50">© 2024 Pure SMP Server</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <CheckoutDialog 
        open={checkoutOpen} 
        onOpenChange={setCheckoutOpen} 
        username={playerUsername}
      />
    </div>
  )
}
