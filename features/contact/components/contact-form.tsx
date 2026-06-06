"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/constants";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) return setError("Please enter your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address");
    if (subject.trim().length < 2) return setError("Please enter a subject");
    if (message.trim().length < 5) return setError("Please enter a message");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const fieldErrors: Record<string, string[]> = data?.details ?? {};
        const firstField = Object.values(fieldErrors)[0];
        throw new Error(firstField?.[0] ?? data?.error ?? "Could not send your message");
      }

      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-[0_10px_40px_rgba(139,0,0,0.1)] hover:shadow-[0_15px_50px_rgba(139,0,0,0.15)] transition-shadow duration-300">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg text-primary">Send us a Message</CardTitle>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="py-6 text-center space-y-2">
            <p className="text-base font-semibold text-primary">Thanks for reaching out!</p>
            <p className="text-sm text-muted-foreground">
              We&apos;ve received your message and will get back to you soon.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setSent(false)}
            >
              Send another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="text-sm font-medium mb-2 block">
                  Name
                </label>
                <Input
                  id="contact-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 sm:h-11 bg-[#faf6f0] border-[#faf6f0] focus:border-secondary focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="text-sm font-medium mb-2 block">
                  Email
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 sm:h-11 bg-[#faf6f0] border-[#faf6f0] focus:border-secondary focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-subject" className="text-sm font-medium mb-2 block">
                Subject
              </label>
              <Input
                id="contact-subject"
                placeholder="How can we help?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-10 sm:h-11 bg-[#faf6f0] border-[#faf6f0] focus:border-secondary focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="text-sm font-medium mb-2 block">
                Message
              </label>
              <Textarea
                id="contact-message"
                placeholder="Tell us more about your inquiry..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-30 sm:min-h-37.5 resize-none bg-[#faf6f0] border-[#faf6f0] focus:border-secondary focus:bg-white"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-10 sm:h-11 shadow-sm shadow-primary/15">
              {loading ? "Sending..." : "Send Message"}
            </Button>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
