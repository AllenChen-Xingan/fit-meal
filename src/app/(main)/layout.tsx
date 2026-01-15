import { BottomNav } from "@/components/bottom-nav"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="pb-20 md:pb-0">{children}</main>
      <BottomNav />
    </>
  )
}
