"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const cmsPages = [
  { title: "Privacy Policy", slug: "/privacy-policy", status: "published" },
  { title: "Terms of Service", slug: "/terms", status: "published" },
  { title: "Cookies Policy", slug: "/cookies-policy", status: "published" },
  { title: "Contact Us", slug: "/contact", status: "published" },
  { title: "Careers", slug: "/careers", status: "published" },
  { title: "About Us", slug: "/about", status: "draft" },
  { title: "FAQs", slug: "/faqs", status: "draft" },
  { title: "Shipping Information", slug: "/shipping", status: "draft" },
];

export default function AdminPagesPage() {
  return (
    <div>
      <h1 className="text-xl sm:text-3xl font-bold mb-6">Manage Pages</h1>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">Page Title</th>
                <th className="text-left p-4 font-medium">URL</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cmsPages.map((page) => (
                <tr key={page.slug} className="hover:bg-muted/50">
                  <td className="p-4 font-medium">{page.title}</td>
                  <td className="p-4 text-muted-foreground">{page.slug}</td>
                  <td className="p-4">
                    <Badge
                      variant={
                        page.status === "published" ? "success" : "outline"
                      }
                    >
                      {page.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
