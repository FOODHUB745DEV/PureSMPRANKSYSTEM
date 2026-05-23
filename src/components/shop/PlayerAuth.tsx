
"use client"

import * as React from "react"
import { User, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface PlayerAuthProps {
  onValidated: (username: string) => void;
}

export function PlayerAuth({ onValidated }: PlayerAuthProps) {
  const [username, setUsername] = React.useState("")
  const [isValidating, setIsValidating] = React.useState(false)
  const [isValid, setIsValid] = React.useState(false)

  const handleValidate = () => {
    if (!username) return
    setIsValidating(true)
    // Simulating API validation
    setTimeout(() => {
      setIsValidating(false)
      setIsValid(true)
      onValidated(username)
    }, 1200)
  }

  return (
    <Card className="overflow-hidden border-2 border-primary/20 glow-hover bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <User className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">Spieler-Identifizierung</CardTitle>
        </div>
        <CardDescription>
          Gib deinen Minecraft-Namen ein, um Käufe zuzuweisen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Input 
              placeholder="Minecraft Username..." 
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setIsValid(false)
              }}
              disabled={isValid}
              className="bg-background/50 border-border focus:border-primary pr-10"
            />
            {isValid && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
            )}
          </div>
          <Button 
            onClick={handleValidate} 
            disabled={isValidating || isValid || !username}
            className="w-full font-headline tracking-wide"
          >
            {isValidating ? "Validierung..." : isValid ? "Bestätigt" : "Account Prüfen"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
