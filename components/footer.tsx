"use client"

import Link from "next/link"
import { Instagram, Twitter, Facebook, Github, Youtube, Linkedin } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-foreground text-background rounded-md font-bold text-sm">
                S
              </div>
              <span className="font-semibold text-lg">SDFM</span>
            </div>
            <p className="text-muted-foreground">{t("footer.brandDescription")}</p>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">{t("footer.followUs")}</h4>
              <div className="flex space-x-3">
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  className="flex items-center justify-center w-9 h-9 bg-muted hover:bg-foreground hover:text-background rounded-md transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  className="flex items-center justify-center w-9 h-9 bg-muted hover:bg-foreground hover:text-background rounded-md transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  className="flex items-center justify-center w-9 h-9 bg-muted hover:bg-foreground hover:text-background rounded-md transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link
                  href="https://youtube.com"
                  target="_blank"
                  className="flex items-center justify-center w-9 h-9 bg-muted hover:bg-foreground hover:text-background rounded-md transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                </Link>
                <Link
                  href="https://github.com"
                  target="_blank"
                  className="flex items-center justify-center w-9 h-9 bg-muted hover:bg-foreground hover:text-background rounded-md transition-colors"
                >
                  <Github className="h-4 w-4" />
                </Link>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  className="flex items-center justify-center w-9 h-9 bg-muted hover:bg-foreground hover:text-background rounded-md transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t("footer.shop")}</h3>
            <div className="space-y-2 text-sm">
              <Link href="/shop" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.allProducts")}
              </Link>
              <Link
                href="/shop?category=new-arrival"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("nav.newArrivals")}
              </Link>
              <Link
                href="/shop?category=best-seller"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("nav.bestSellers")}
              </Link>
              <Link
                href="/shop?category=limited-edition"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("nav.limitedEdition")}
              </Link>
              <Link
                href="/shop?category=sale"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("nav.sale")}
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t("footer.support")}</h3>
            <div className="space-y-2 text-sm">
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.contact")}
              </Link>
              <Link href="/shipping" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.shipping")}
              </Link>
              <Link href="/returns" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.returns")}
              </Link>
              <Link href="/size-guide" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.sizeGuide")}
              </Link>
              <Link href="/faq" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.faq")}
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t("footer.company")}</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.about")}
              </Link>
              <Link href="/careers" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.careers")}
              </Link>
              <Link
                href="/sustainability"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("footer.sustainability")}
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.terms")}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              <p>{t("footer.copyright")}</p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{t("footer.paymentMethods")}:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-muted rounded border flex items-center justify-center">
                  <span className="text-xs font-bold">V</span>
                </div>
                <div className="w-8 h-5 bg-muted rounded border flex items-center justify-center">
                  <span className="text-xs font-bold">MC</span>
                </div>
                <div className="w-8 h-5 bg-muted rounded border flex items-center justify-center">
                  <span className="text-xs font-bold">PP</span>
                </div>
                <div className="w-8 h-5 bg-muted rounded border flex items-center justify-center">
                  <span className="text-xs font-bold">AP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
