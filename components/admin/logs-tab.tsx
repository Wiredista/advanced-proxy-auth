"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Trash, AlertTriangle, Info } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Log = {
  id: string
  username: string
  ip: string
  timestamp: Date
}

export default function LogsTab() {
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
    // Placeholder fetch to get logs from the API
    async function fetchLogs() {
      try {
        const response = await fetch("/api-proxyauth-admin/logs")
        const data = await response.json()
        setLogs(data)
      } catch (error) {
        console.error("Failed to fetch logs:", error)
      }
    }

    fetchLogs()
  }, [])

  const handleClearLogs = () => {
    fetch("/api-proxyauth-admin/logs", { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setLogs([])
        } else {
          console.error("Failed to clear logs")
        }
      })
      .catch((error) => {
        console.error("Error clearing logs:", error)
      })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
          <p className="text-muted-foreground">
            View system and authentication logs
          </p>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash className="h-4 w-4" />
              Clear Logs
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete all logs from the system. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleClearLogs}
                className="bg-red-600 hover:bg-red-700"
              >
                Clear All Logs
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Logging Information</AlertTitle>
        <AlertDescription>
          To prevent excessive log entries, each user's activity is logged at most once every 5 minutes.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Access Logs</CardTitle>
          <CardDescription>
            Recent user activity and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Date and Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.username}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell>{(new Date(log.timestamp)).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-lg font-medium">No logs found</p>
              <p className="text-sm text-muted-foreground">
                There are currently no logs in the system.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

