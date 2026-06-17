export default function BasiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen w-full flex flex-col  overflow-x-hidden"
      style={{
        backgroundImage: 'url("/images/fond.jpg")',
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {children}
    </main>
  );
}
