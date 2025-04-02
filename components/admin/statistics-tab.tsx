import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - in a real app, this would come from your API
const statisticsData = {
  last24h: {
    requestCount: 1247,
    uniqueVisitors: 356,
    failedAuthentications: 23,
  },
  last7d: {
    requestCount: 8932,
    uniqueVisitors: 2104,
    failedAuthentications: 142,
  },
}

export default function StatisticsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground">Overview of your authentication proxy metrics</p>
      </div>

      <Tabs defaultValue="24h" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="24h" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last 24 Hours
            </TabsTrigger>
            <TabsTrigger value="7d" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last 7 Days
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="24h" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Total Requests"
              value={statisticsData.last24h.requestCount.toLocaleString()}
              description="Total requests in the last 24 hours"
            />
            <StatCard
              title="Unique Visitors"
              value={statisticsData.last24h.uniqueVisitors.toLocaleString()}
              description="Distinct users in the last 24 hours"
            />
            <StatCard
              title="Failed Authentications"
              value={statisticsData.last24h.failedAuthentications.toLocaleString()}
              description="Authentication failures in the last 24 hours"
              isNegative
            />
          </div>
        </TabsContent>

        <TabsContent value="7d" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Total Requests"
              value={statisticsData.last7d.requestCount.toLocaleString()}
              description="Total requests in the last 7 days"
            />
            <StatCard
              title="Unique Visitors"
              value={statisticsData.last7d.uniqueVisitors.toLocaleString()}
              description="Distinct users in the last 7 days"
            />
            <StatCard
              title="Failed Authentications"
              value={statisticsData.last7d.failedAuthentications.toLocaleString()}
              description="Authentication failures in the last 7 days"
              isNegative
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  description: string
  isNegative?: boolean
}

function StatCard({ title, value, description, isNegative = false }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isNegative ? "text-red-500" : ""}`}>{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

