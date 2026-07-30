export default function SettingsPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-background border border-border/50 rounded-3xl p-6 md:p-10 shadow-sm max-w-3xl">
        <div className="flex flex-col gap-8">
          
          <div className="flex items-center gap-6 pb-8 border-b border-border/50">
            <div className="h-24 w-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold">
              J
            </div>
            <div>
              <button className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-full text-sm font-medium transition-colors mb-2">
                Upload Photo
              </button>
              <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
               <span className="font-bold text-lg bg-background px-4 py-2 rounded-full shadow-sm border border-border">FORM INTEGRATION IN PHASE 2</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">First Name</label>
              <input type="text" defaultValue="James" disabled className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Last Name</label>
              <input type="text" defaultValue="Bond" disabled className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium">Email Address</label>
              <input type="email" defaultValue="james@example.com" disabled className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm" />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
