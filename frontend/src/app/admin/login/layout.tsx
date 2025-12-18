export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout completely replaces the parent admin layout
    // No AdminProtectedRoute, no sidebar, no header
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
