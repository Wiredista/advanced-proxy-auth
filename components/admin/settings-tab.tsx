import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

export default function SettingsTab() {
  const [settings, setSettings] = useState({
    authMode: "",
    proxyHost: "",
    proxyPort: "",
    proxyProtocol: "",
    proxyUrl: "",
    logAccess: false,
  })
  
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api-proxyauth-admin/settings")
        if (!response.ok) {
          throw new Error("Failed to fetch settings")
        }
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchSettings()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure system settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>These settings are read-only and cannot be changed here. To change them, please edit the environment variables in the .env file or check the documentation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="authMode">Authentication Mode</Label>
          <Input id="authMode" value={settings.authMode} readOnly className="mt-2" disabled/>
          <Label htmlFor="proxyHost" className="mt-4">Proxy Host</Label>
          <Input id="proxyHost" value={settings.proxyHost} readOnly className="mt-2" disabled/>
          <Label htmlFor="proxyPort" className="mt-4">Proxy Port</Label>
          <Input id="proxyPort" value={settings.proxyPort} readOnly className="mt-2" disabled/>
          <Label htmlFor="proxyProtocol" className="mt-4">Proxy Protocol</Label>
          <Input id="proxyProtocol" value={settings.proxyProtocol} readOnly className="mt-2" disabled/>
          <Label htmlFor="proxyUrl" className="mt-4">Proxy URL</Label>
          <Input id="proxyUrl" value={settings.proxyUrl} readOnly className="mt-2" disabled/>
          <Label htmlFor="logAccess" className="mt-4">Log Access</Label>
          <Input id="logAccess" value={settings.logAccess ? "Enabled" : "Disabled"} readOnly className="mt-2" disabled/>
        </CardContent>
      </Card>
    </div>
  )
}

