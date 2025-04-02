import AdminDashboard from "@/components/admin/dashboard"

export default function AdminPage() {
  // In a real app, you would check authentication/authorization here
  // const isAuthenticated = checkAuth()
  // const isAdmin = checkAdminRole()
  // if (!isAuthenticated || !isAdmin) redirect('/login')

  return <AdminDashboard />
}

