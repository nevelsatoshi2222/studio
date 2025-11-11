'use client';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, BookOpen, LifeBuoy } from 'lucide-react';

const faqs = [
  {
    question: "What is Public Governance?",
    answer: "Public Governance is a decentralized platform that allows users to participate in governance, from local to international issues, through a secure and transparent voting system."
  },
  {
    question: "How do I earn PGC?",
    answer: "You can earn Public Governance Coin (PGC) through various activities such as participating in the presale, completing the financial awareness quiz, earning commissions through the affiliate program, or winning rewards in our global competitions."
  },
  {
    question: "How does the affiliate program work?",
    answer: "Share your unique referral link to invite new users. When they join and participate, you earn commissions and rewards based on your team's size and activity. You can track your team and earnings on the 'My Team' page."
  },
  {
    question: "Where can I vote on issues?",
    answer: "You can vote on a wide range of topics in the 'Voting Hub'. This section is divided into international, national, state, and local levels to ensure your voice is heard where it matters most."
  },
  {
    question: "What is the purpose of the different coins (IGC, PGC, ITC)?",
    answer: "PGC (Public Governance Coin) is the primary token for voting on public issues. IGC (Idea Governance Coin) is used for platform-specific governance and staking. ITC (International Trade Coin) is a stablecoin pegged to gold, used for e-commerce and trade."
  },
];

export default function HelpPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div>
          <h1 className="font-headline text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">
            Find answers to your questions and get help with the platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LifeBuoy /> Contact Support</CardTitle>
              <CardDescription>Can't find an answer? Reach out to our support team directly.</CardDescription>
            </CardHeader>
            <CardContent>
              <a href="mailto:support@publicgovernance.app" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted">
                <Mail className="h-6 w-6 text-primary"/>
                <div>
                    <p className="font-semibold">Email Us</p>
                    <p className="text-sm text-muted-foreground">support@publicgovernance.app</p>
                </div>
              </a>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen /> Knowledge Base</CardTitle>
              <CardDescription>Read our documentation and guides to learn more about the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <a href="/vision" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted">
                    <BookOpen className="h-6 w-6 text-primary"/>
                    <div>
                        <p className="font-semibold">Read Our Vision</p>
                        <p className="text-sm text-muted-foreground">Understand the core principles of our platform.</p>
                    </div>
                </a>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions (FAQ)</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
