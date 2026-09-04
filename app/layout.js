import "./globals.css";
import { Playfair_Display } from "next/font/google";
import collection from "../collection.config.js";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={playfair.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try {
    var t = localStorage.getItem("kla-theme");
    var d = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (t === "dark" || (!t && d)) document.documentElement.classList.add("dark");
  } catch(e) {}
})();
`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
