import "./globals.css";

export const metadata = {
  title: "APW-TECH s.r.o. | Priemyselná údržba a servis",
  description:
    "APW-TECH s.r.o. poskytuje servis strojov, priemyselnú údržbu, opravy komponentov a technickú podporu pre výrobné spoločnosti.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="lang-sk" id="body">
        {children}
      </body>
    </html>
  );
}
