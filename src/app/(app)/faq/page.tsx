import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ | Ahsan Ai Hub',
  description: 'Frequently Asked Questions about Ahsan Ai Hub.',
};

const FAQData = [
    { q: "What is Ahsan Ai Hub?", a: "Ahsan Ai Hub is an intelligent AI-powered chat platform designed to assist users in learning, writing, coding, generating ideas, solving queries, and more through a smart and responsive AI system." },
    { q: "How does this AI work?", a: "Ahsan Ai Hub uses advanced AI models to understand user queries and respond naturally, accurately, and instantly. It generates answers based on context, logic, and real-time interpretation of your message." },
    { q: "Do I need an account to use the AI chatbot?", a: "An account is required to save favorite tools and get personalized recommendations, but many features are available without one." },
    { q: "Is Ahsan Ai Hub free to use?", a: "Yes, the main features of the app are currently free for all users. Any premium features added later will always have a basic free alternative." },
    { q: "What kind of questions can I ask the AI?", a: "You can ask anything related to: General knowledge, Writing help (essays, stories, emails), Coding & debugging, Learning topics (ICT, networking, science, etc.), Daily life guidance, Creative ideas & summaries." },
    { q: "Can the chatbot write code or debug programs?", a: "Yes. The AI can generate, explain, review, and improve code in various languages like Python, C, JavaScript, HTML, CSS, Java, and more." },
    { q: "Will Ahsan Ai Hub remember chats?", a: "For now, conversations are not saved. In upcoming versions, cloud-based persistent chat history and saved prompts will be added." },
    { q: "Can I share or export my chat?", a: "Yes, the platform provides options to copy responses. Future updates may include export as PDF or text." },
    { q: "Is my data safe?", a: "User privacy is important. Ahsan Ai Hub does not store any personal chat content on servers unless the user enables account-based history features." },
    { q: "How can I contact the developer?", a: "You can contact Ahsan Ali — the creator of Ahsan Ai Hub — through the social media links on the 'Contact' page." },
    { q: "What features are coming soon?", a: "🚀 Custom chat personalities, 🚀 Cloud-based chat history & export, 🚀 Voice chat communication, 🚀 User accounts & premium tools, 🚀 Prompt library + AI tips section." },
];


export default function FaqPage() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader title="FAQ" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-8">
            <div className="mb-8">
                <h1 className="font-headline text-3xl font-bold">Frequently Asked Questions</h1>
                <p className="mt-2 text-muted-foreground">Find answers to common questions about Ahsan Ai Hub.</p>
            </div>
          
            <Accordion type="single" collapsible className="w-full">
              {FAQData.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Card className="bg-accent/15 text-center">
                <CardContent className="p-8">
                    <HelpCircle className="mx-auto mb-4 h-10 w-10 text-accent" />
                    <h3 className="font-headline text-xl font-semibold">Still have questions?</h3>
                    <p className="mt-2 text-muted-foreground">
                        If you can't find the answer you're looking for, feel free to reach out to the developer.
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/contact">Contact Developer</Link>
                    </Button>
                </CardContent>
            </Card>

             {/* Footer */}
            <footer className="py-8 text-center text-sm text-muted-foreground">
                <p>We're constantly improving. Thank you for your support!</p>
            </footer>
        </div>
      </div>
    </div>
  );
}
