// src/components/Footer.tsx
"use client";

import Link from "next/link";
import { Heart, Code, Github, Linkedin, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Discover", href: "/networks" },
        { label: "Messages", href: "/messages" },
        { label: "Connections", href: "/lists" },
        { label: "Profile", href: "/networks/edit" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/tos" },
        { label: "Cookie Policy", href: "/cookie" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/zzelif/builder-round-devmatch",
      label: "GitHub",
    },
    { icon: Linkedin, href: "", label: "LinkedIn" },
    { icon: Mail, href: "mailto:support@devmatch.com", label: "Email" },
  ];

  return (
    <footer className="bg-background border-t border-border/50 pt-20">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              <Code className="w-6 h-6 text-primary" />
              DevMatch
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect with fellow developers who share your passion for code and
              innovation.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  title={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            <p>
              © {currentYear} DevMatch. Built with{" "}
              <Heart className="w-4 h-4 inline text-red-500 fill-red-500" /> by
              developers, for developers.
            </p>
          </div>

          {/* Stats/Features */}
          <div className="flex gap-6 text-xs text-muted-foreground">
            <div className="text-center">
              <p className="font-semibold text-foreground">99+</p>
              <p>Developers</p>
            </div>
            <div className="h-8 w-px bg-border/50"></div>
            <div className="text-center">
              <p className="font-semibold text-foreground">99+</p>
              <p>Matches</p>
            </div>
            <div className="h-8 w-px bg-border/50"></div>
            <div className="text-center">
              <p className="font-semibold text-foreground">99+</p>
              <p>Tech Stacks</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
