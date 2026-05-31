import type { Metadata } from "next";
import { Briefcase, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/lib/proxy";

export const metadata: Metadata = {
  title: "Careers",
};

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
};

async function getContent(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.careers || json?.careers || null;
  } catch {
    return null;
  }
}

async function getJobs(): Promise<Job[]> {
  try {
    const res = await fetch(`${API_URL}/api/jobs`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export default async function CareersPage() {
  const [content, jobs] = await Promise.all([getContent(), getJobs()]);

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100svh-4rem)]">
    <div className="w-full mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
          Join Our Team
        </p>
        <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
          Careers at Madhur Sweet
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Join our family of passionate sweet makers and help us spread sweetness
          across India. We offer a supportive work environment, competitive
          salaries, and growth opportunities.
        </p>
      </div>

      {content ? (
        <div className="space-y-4 text-foreground/90 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
          {content}
        </div>
      ) : jobs.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {jobs.map((job) => (
            <Card key={job.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <CardTitle className="text-lg sm:text-xl leading-snug">
                    {job.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs">{job.department}</Badge>
                    <Badge variant="outline" className="text-xs">{job.type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  {job.location}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                  {job.description}
                </p>
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 sm:px-4 sm:py-3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    To apply, send your resume and cover letter to{" "}
                    <a
                      href={`mailto:careers@madhursweet.com?subject=Application for ${encodeURIComponent(job.title)}`}
                      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 break-all"
                    >
                      careers@madhursweet.com
                    </a>
                    {" "}with the subject{" "}
                    <span className="font-medium text-foreground wrap-break-word">Application for {job.title}</span>.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-border py-16 sm:py-24 text-center px-4">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-muted">
            <Briefcase className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground/50" />
          </div>
          <div>
            <p className="font-semibold text-base sm:text-lg">No open positions right now</p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-xs sm:max-w-sm mx-auto">
              We are not hiring at the moment, but check back soon. Great opportunities open up regularly.
            </p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
