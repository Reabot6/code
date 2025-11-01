"use client"

import Link from "next/link"
import { Heart, Github, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-xs">
                TB
              </div>
              <span className="font-semibold text-foreground">TechBridge</span>
            </div>
            <p className="text-sm text-muted-foreground">Closing the digital divide, one device at a time.</p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/mission" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Request Devices
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/contributor"
                  className="text-sm text-muted-foreground hover:text-foreground transition"
                >
                  Become a Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Connect</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com/Reabot6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:onimisiadeolu@gmail.com"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a href="/mission" className="text-muted-foreground hover:text-foreground transition">
                <Heart className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">&copy; 2025 TechBridge. All rights reserved.</p>
          <p className="text-xs text-muted-foreground mt-4 sm:mt-0">
            Made with <Heart className="w-3 h-3 inline text-red-500" /> to close the digital divide
          </p>
        </div>
      </div>
    </footer>
  )
}
