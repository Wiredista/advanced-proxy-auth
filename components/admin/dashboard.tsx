"use client"

import { useState, useEffect } from "react"
import { BarChart3, Cog, FileText, Home, LogOut, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

import StatisticsTab from "@/components/admin/statistics-tab"
import UserManagementTab from "@/components/admin/user-management-tab"
import LogsTab from "@/components/admin/logs-tab"
import SettingsTab from "@/components/admin/settings-tab"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("statistics")

  useEffect(() => {
    const checkAdmin = async () => {
      const response = await fetch('/api-proxyauth-admin/am-i-admin')
      const isAuthenticated = response.ok
      if (!isAuthenticated) window.location.href = '/proxyauth/error?error=403&redirect=/proxyauth/admin'
    }
    checkAdmin()
  }, [])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-lg font-semibold">Advanced Proxy Auth</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "statistics"} onClick={() => setActiveTab("statistics")}>
                  <Home className="h-4 w-4" />
                  <span>Statistics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "users"} onClick={() => setActiveTab("users")}>
                  <Users className="h-4 w-4" />
                  <span>User Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "logs"} onClick={() => setActiveTab("logs")}>
                  <FileText className="h-4 w-4" />
                  <span>Logs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "settings"} onClick={() => setActiveTab("settings")}>
                  <Cog className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/logout">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </a>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 p-6">
          <div className="mx-auto max-w-6xl">
            {activeTab === "statistics" && <StatisticsTab />}
            {activeTab === "users" && <UserManagementTab />}
            {activeTab === "logs" && <LogsTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

