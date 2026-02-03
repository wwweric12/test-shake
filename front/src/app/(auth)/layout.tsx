export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-custom-white relative flex h-dvh w-full max-w-[440px] min-w-[375px] flex-col overflow-hidden shadow-xl">
      <main className="custom-scrollbar flex flex-1 flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
