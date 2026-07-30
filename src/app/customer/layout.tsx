import { CustomerSidebar } from "@/components/customer/CustomerSidebar"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mock User for Phase 1 (to be replaced by NextAuth session check in Phase 2)
  const mockUser = {
    name: "James",
    isAuthenticated: true,
  }

  // If !mockUser.isAuthenticated, we would redirect to /login here

  return (
    <div className="bg-muted/10 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-[1400px]">
        
        {/* Mobile Header Greeting */}
        <div className="md:hidden mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-medium tracking-tight">Dashboard</h1>
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
            {mockUser.name.charAt(0)}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          <CustomerSidebar />
          
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
