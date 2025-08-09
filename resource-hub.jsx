import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen, Shield, HelpCircle, MapPin, TestTube, HeartHandshake, Sparkles, Download, Mail, MessageCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

// --- content store (static copy the team can edit quickly) ---
const quickFacts = [
  {
    tag: "HIVST",
    title: "What is HIV Self‑Testing (HIVST)?",
    body:
      "HIVST lets you collect your own specimen (oral fluid or finger‑prick blood), perform the test, and read the result privately. Results are screening results—reactive tests must be confirmed at a clinic.",
  },
  {
    tag: "PrEP",
    title: "What is PrEP?",
    body:
      "Pre‑exposure prophylaxis (PrEP) is HIV prevention medicine for HIV‑negative people at higher risk. When taken as prescribed, PrEP greatly reduces the risk of getting HIV from sex or injecting drug use.",
  },
  {
    tag: "Privacy",
    title: "Privacy & Confidentiality",
    body:
      "You can test in private and choose who to tell. If your test is reactive, health workers must keep your information confidential and support confirmatory testing and care.",
  },
];

const topics = [
  {
    key: "hivst-basics",
    label: "HIVST Basics",
    icon: <TestTube className="h-4 w-4" />,
    sections: [
      {
        h: "How it works",
        p: [
          "Most kits use oral fluid or a finger‑prick blood sample.",
          "Step‑by‑step: prepare the kit • collect the sample • start the test • wait 15–20 minutes • read result.",
          "A reactive result = possible HIV infection and needs a clinic‑based confirmatory test. A non‑reactive result means no HIV was detected, but repeat testing is recommended if you had a recent exposure.",
        ],
      },
      {
        h: "When to use",
        p: [
          "After a potential exposure wait the kit’s window period (often ~3–12 weeks depending on kit) before relying on a non‑reactive result.",
          "Use HIVST as part of routine sexual health—e.g., every 3–6 months if you are sexually active with new or multiple partners.",
        ],
      },
      {
        h: "What’s next after a reactive result?",
        p: [
          "Go for confirmatory testing immediately at an approved facility.",
          "If confirmed HIV‑positive, start treatment (ART) early for best health and to prevent transmission (U=U).",
        ],
      },
    ],
  },
  {
    key: "prep-guide",
    label: "PrEP Guide",
    icon: <Shield className="h-4 w-4" />,
    sections: [
      {
        h: "Who should consider PrEP?",
        p: [
          "Anyone HIV‑negative with ongoing risk (e.g., multiple partners, inconsistent condom use, partner with unknown/positive status, transactional sex).",
        ],
      },
      {
        h: "How to take PrEP",
        p: [
          "Daily oral pills (TDF/FTC) are the most common.",
          "Long‑acting injectable PrEP (cabotegravir) may be available in some settings—given every 2 months by a provider.",
        ],
      },
      {
        h: "Effectiveness & side effects",
        p: [
          "When taken as prescribed, PrEP reduces sexual HIV risk by ~99%.",
          "Mild side effects (nausea, headache) often settle in a few days to weeks. Speak to a clinician if side effects persist.",
        ],
      },
      {
        h: "Starting PrEP",
        p: [
          "You must test HIV‑negative before starting and test regularly while on PrEP.",
          "Discuss STI screening, contraception, and kidney check where required.",
        ],
      },
    ],
  },
  {
    key: "myths-facts",
    label: "Myths & Facts",
    icon: <BookOpen className="h-4 w-4" />,
    faqs: [
      {
        q: "Myth: HIVST gives a final diagnosis.",
        a: "Fact: HIVST is a screening test. Reactive results must be confirmed by a provider using validated algorithms.",
      },
      {
        q: "Myth: PrEP is only for certain groups.",
        a: "Fact: PrEP is for anyone at substantial risk of HIV regardless of gender or orientation—talk to a provider to assess suitability.",
      },
      {
        q: "Myth: Testing positive means people will know.",
        a: "Fact: Your results and care are confidential. You choose whom to tell and when.",
      },
    ],
  },
  {
    key: "find-services",
    label: "Find Services",
    icon: <MapPin className="h-4 w-4" />,
    sections: [
      {
        h: "Where to get HIVST kits",
        p: [
          "Pharmacies, community distributors, youth clinics, and outreach campaigns (locations vary—add local partners below).",
        ],
      },
      {
        h: "PrEP & confirmatory testing",
        p: [
          "Add local clinics, hotlines, and hours here. Include cost info and whether youth‑friendly services are available.",
        ],
      },
    ],
  },
  {
    key: "ask-expert",
    label: "Ask an Expert",
    icon: <HelpCircle className="h-4 w-4" />,
    sections: [
      {
        h: "Q&A and Support",
        p: [
          "Use the form below to submit anonymous questions. A qualified counselor or clinician responds within 24–72 hours.",
          "Emergency? Use local hotlines listed in the Services section.",
        ],
      },
    ],
  },
];

const partners = [
  { name: "Youth Clinics", note: "Adolescent‑friendly health services" },
  { name: "NGO Partners", note: "Community outreach & counseling" },
  { name: "Pharmacy Network", note: "Retail access to HIVST kits" },
];

const downloads = [
  { name: "Card Game – Print‑Ready Deck (PDF)", href: "#", size: "2.3 MB" },
  { name: "Facilitator Guide – HIVST & PrEP Sessions (PDF)", href: "#", size: "1.1 MB" },
  { name: "Myths & Facts Handout (PDF)", href: "#", size: "420 KB" },
];

export default function ResourceHub() {
  const [query, setQuery] = useState("");

  const searchable = useMemo(() => {
    const items: { title: string; text: string; topic: string }[] = [];
    topics.forEach((t) => {
      t.sections?.forEach((s) => items.push({ title: `${t.label} — ${s.h}`, text: s.p.join(" "), topic: t.key }));
      t.faqs?.forEach((f) => items.push({ title: `${t.label} — ${f.q}`, text: f.a, topic: t.key }));
    });
    return items;
  }, []);

  const results = searchable.filter((x) => (x.title + x.text).toLowerCase().includes(query.toLowerCase())).slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold tracking-tight">
            HIV Self‑Testing (HIVST) & PrEP Resource Hub
          </motion.h1>
          <p className="mt-4 text-white/90 max-w-2xl">
            Clear, youth‑friendly guidance on testing, prevention, and care—plus tools for clubs, schools, and community groups.
          </p>
          <div className="mt-6 grid gap-3 sm:flex sm:items-center">
            <div className="sm:w-2/3">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search HIVST, PrEP, myths, services…" className="bg-white/95 text-gray-900" />
              {query && (
                <Card className="mt-2">
                  <CardContent className="p-0">
                    <ul className="divide-y">
                      {results.length === 0 && <li className="p-3 text-sm">No matches. Try a different term.</li>}
                      {results.map((r, i) => (
                        <li key={i} className="p-3 text-sm hover:bg-gray-50">{r.title}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="sm:w-1/3 flex gap-3">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-white/90"><Sparkles className="h-4 w-4 mr-2" />Start Trivia</Button>
              <Button size="lg" variant="secondary" className="bg-white/20 text-white hover:bg-white/30"><Download className="h-4 w-4 mr-2" />Download Cards</Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge className="bg-white/20">Confidential</Badge>
            <Badge className="bg-white/20">Youth‑friendly</Badge>
            <Badge className="bg-white/20">Actionable</Badge>
          </div>
        </div>
      </section>

      {/* quick facts */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 grid md:grid-cols-3 gap-4">
        {quickFacts.map((q) => (
          <Card key={q.title} className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">{q.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">{q.body}</CardContent>
          </Card>
        ))}
      </section>

      {/* main tabs */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <Tabs defaultValue="hivst-basics">
          <TabsList className="flex flex-wrap justify-start">
            {topics.map((t) => (
              <TabsTrigger key={t.key} value={t.key} className="flex items-center gap-2">
                {t.icon}{t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {topics.map((t) => (
            <TabsContent key={t.key} value={t.key} className="mt-6">
              {/* sections */}
              {t.sections && (
                <div className="grid md:grid-cols-2 gap-6">
                  {t.sections.map((s, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />{s.h}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-4 text-sm text-gray-700 space-y-2">
                          {s.p.map((pp, j) => <li key={j}>{pp}</li>)}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* FAQs */}
              {t.faqs && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>FAQs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {t.faqs.map((f, i) => (
                        <AccordionItem key={i} value={`item-${i}`}>
                          <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                          <AccordionContent className="text-gray-700">{f.a}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              {/* Ask an expert form (for Ask‑Expert tab) */}
              {t.key === "ask-expert" && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5" />Submit a question</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input placeholder="Your email (optional)" />
                      <Input placeholder="Preferred reply method (email/WhatsApp)" />
                      <div className="md:col-span-2">
                        <textarea className="w-full rounded-md border p-3" rows={5} placeholder="Type your anonymous question here…"></textarea>
                      </div>
                      <div className="md:col-span-2 flex gap-3">
                        <Button><Mail className="h-4 w-4 mr-2" />Send</Button>
                        <Button variant="secondary">Clear</Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">Responses by qualified counselors within 24–72 hours. If this is urgent, please use the hotline in Find Services.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* progress & engagement */}
      <section className="max-w-6xl mx-auto px-6 pb-10 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Club / Classroom Session</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 space-y-3">
            <p>Run a 45‑minute session: 15‑min trivia • 15‑min card scenarios • 15‑min Q&A.</p>
            <p>Use the facilitator guide and track progress below.</p>
            <div>
              <p className="text-xs mb-2">Example completion</p>
              <Progress value={66} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HeartHandshake className="h-5 w-5" />Partners</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            <ul className="space-y-2">
              {partners.map((p, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{p.name}</span>
                  <span className="text-gray-500 text-xs">{p.note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" />Downloads</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            <ul className="space-y-2">
              {downloads.map((d, i) => (
                <li key={i} className="flex items-center justify-between">
                  <a href={d.href} className="underline hover:no-underline">{d.name}</a>
                  <span className="text-gray-500 text-xs">{d.size}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* footer */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-gray-600 grid md:grid-cols-3 gap-6">
          <div>
            <p className="font-semibold">Disclaimer</p>
            <p>
              Educational content only; not a substitute for professional medical advice. Confirm local guidelines and service availability.
            </p>
          </div>
          <div>
            <p className="font-semibold">SDG Alignment</p>
            <ul className="list-disc pl-4">
              <li>SDG 3: Good Health & Well‑being</li>
              <li>SDG 4: Quality Education</li>
              <li>SDG 10: Reduced Inequalities</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Contact</p>
            <p>Add local hotline(s), clinic contacts, and office hours here.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
