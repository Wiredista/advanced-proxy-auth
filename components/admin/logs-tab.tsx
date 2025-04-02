"use client"

import { useState } from "react"
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

// Mock data - in a real app, this would come from your API
const initialLogs = [
  {
    id: "1",
    username: "johndoe",
    timestamp: new Date("2023-04-01T14:32:00"),
    route: "/dashboard",
  },
  {
    id: "2",
    username: "janesmith",
    timestamp: new Date("2023-04-01T14:30:00"),
    route: "/settings",
  },
  {
    id: "3",
    username: "rjohnson",
    timestamp: new Date("2023-04-01T14:25:00"),
    route: "/api/data",
  },
  {
    id: "4",
    username: "emilyd",
    timestamp: new Date("2023-04-01T14:20:00"),
    route: "/users",
  },
  {
    id: "5",
    username: "mwilson",
    timestamp: new Date("2023-04-01T14:15:00"),
    route: "/admin",
  },
  {
    id: "6",
    username: "johndoe",
    timestamp: new Date("2023-04-01T14:02:00"),
    route: "/profile",
  },
  {
    id: "7",
    username: "guest",
    timestamp: new Date("2023-04-01T13:55:00"),
    route: "/login",
  },
  {
    id: "8",
    username: "admin",
    timestamp: new Date("2023-04-01T13:45:00"),
    route: "/admin/settings",
  },
  {
    id: "9",
    username: "janesmith",
    timestamp: new Date("2023-04-01T13:30:00"),
    route: "/api/users",
  },
  {
    id: "10",
    username: "system",
    timestamp: new Date("2023-04-01T13:00:00"),
    route: "/api/health",
  },
]

type Log = {
  id: string
  username: string
  timestamp: Date
  route: string
}

export default function LogsTab() {
  const [logs, setLogs] = useState<Log[]>(initialLogs)

  const handleClearLogs = () => {
    // In a real app, you would call your API here
    setLogs([])
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
          To prevent excessive log entries, each user's activity is logged at most once every 5 minutes per route.
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
                  <TableHead>Date and Time</TableHead>
                  <TableHead>Route</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.username}</TableCell>
                    <TableCell>{format(log.timestamp, "MMM d, yyyy h:mm:ss a")}</TableCell>
                    <TableCell>{log.route}</TableCell>
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

