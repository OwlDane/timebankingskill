'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, HelpCircle, Zap, Shield, TrendingUp, Users, Lock } from 'lucide-react';

interface FAQItem {
    category: string;
    icon: React.ReactNode;
    questions: {
        id: string;
        question: string;
        answer: string;
    }[];
}

const categoryIcons: Record<string, React.ReactNode> = {
    'Getting Started': <HelpCircle className="h-5 w-5" />,
    'Skills & Teaching': <Zap className="h-5 w-5" />,
    'Sessions & Learning': <TrendingUp className="h-5 w-5" />,
    'Credits & Transactions': <Shield className="h-5 w-5" />,
    'Reviews & Ratings': <Users className="h-5 w-5" />,
    'Safety & Community': <Lock className="h-5 w-5" />,
};

const faqData: FAQItem[] = [
    {
        category: 'Getting Started',
        icon: categoryIcons['Getting Started'],
        questions: [
            {
                id: 'gs-1',
                question: 'How do I create an account on Wibi?',
                answer: 'Creating an account is simple! Click the "Sign Up" button on the homepage, fill in your email, password, and basic information. You\'ll receive a confirmation email to verify your account. Once verified, you can start exploring the platform.',
            },
            {
                id: 'gs-2',
                question: 'Is there a cost to join Wibi?',
                answer: 'No! Wibi is completely free to join. There are no membership fees, subscription costs, or hidden charges. You only exchange time credits for skills.',
            },
            {
                id: 'gs-3',
                question: 'How many credits do I start with?',
                answer: 'New users start with 3 free time credits. This gives you enough to book your first session and get a feel for how the platform works.',
            },
            {
                id: 'gs-4',
                question: 'What is a time credit?',
                answer: 'A time credit represents one hour of service. Whether you\'re teaching calculus or guitar, one hour = one credit. This makes the system fair and equal for everyone.',
            },
        ],
    },
    {
        category: 'Skills & Teaching',
        icon: categoryIcons['Skills & Teaching'],
        questions: [
            {
                id: 'st-1',
                question: 'What skills can I teach?',
                answer: 'You can teach any skill you\'re knowledgeable about! This includes academic subjects (math, languages, science), hobbies (music, art, sports), technical skills (programming, design), and more. Be honest about your expertise level.',
            },
            {
                id: 'st-2',
                question: 'How do I add a skill I can teach?',
                answer: 'Go to your profile, click "Add New Skill," select from our skill categories, set your proficiency level, and add a description of what you can teach. You can add as many skills as you want.',
            },
            {
                id: 'st-3',
                question: 'Can I edit or delete my skills?',
                answer: 'Yes! You can edit your skill descriptions, availability, and other details anytime. You can also mark skills as unavailable if you\'re temporarily unable to teach them.',
            },
            {
                id: 'st-4',
                question: 'How do I earn credits?',
                answer: 'You earn credits by teaching other students. When you complete a session as a teacher, you receive time credits equal to the session duration. For example, a 1-hour session = 1 credit earned.',
            },
        ],
    },
    {
        category: 'Sessions & Learning',
        icon: categoryIcons['Sessions & Learning'],
        questions: [
            {
                id: 'sl-1',
                question: 'How do I book a session?',
                answer: 'Browse the marketplace, find a skill you want to learn, select a tutor, and click "Request Session." Specify your preferred date, time, duration, and whether you want online or in-person. The tutor will review and approve your request.',
            },
            {
                id: 'sl-2',
                question: 'Can I choose between online and in-person sessions?',
                answer: 'Yes! When booking a session, you can specify your preference. Some tutors may offer both options, while others might specialize in one. Check the tutor\'s profile for their available session types.',
            },
            {
                id: 'sl-3',
                question: 'What happens if I need to cancel a session?',
                answer: 'You can cancel sessions up to 24 hours before the scheduled time. Your credits will be refunded. Cancellations within 24 hours may result in credit loss depending on the tutor\'s policy.',
            },
            {
                id: 'sl-4',
                question: 'How long are sessions?',
                answer: 'Sessions can be any duration you and the tutor agree on. Most sessions are 1-2 hours, but you can book shorter or longer sessions based on your needs and the tutor\'s availability.',
            },
        ],
    },
    {
        category: 'Credits & Transactions',
        icon: categoryIcons['Credits & Transactions'],
        questions: [
            {
                id: 'ct-1',
                question: 'Do credits expire?',
                answer: 'No! Your time credits never expire. You can save them for as long as you want and use them whenever you\'re ready to book a session.',
            },
            {
                id: 'ct-2',
                question: 'What happens if I run out of credits?',
                answer: 'If you run out of credits, you can\'t book new sessions until you earn more by teaching. Consider listing a skill you can teach to earn credits quickly.',
            },
            {
                id: 'ct-3',
                question: 'Can I see my transaction history?',
                answer: 'Yes! Go to your dashboard and click "Transaction History" to see all your credit transactions. You can see when you earned or spent credits and the reason for each transaction.',
            },
            {
                id: 'ct-4',
                question: 'What if there\'s a dispute about credits?',
                answer: 'If there\'s a disagreement about a session or credits, you can report it through the platform. Our support team will review the case and make a fair decision based on session details and reviews.',
            },
        ],
    },
    {
        category: 'Reviews & Ratings',
        icon: categoryIcons['Reviews & Ratings'],
        questions: [
            {
                id: 'rr-1',
                question: 'How does the rating system work?',
                answer: 'After each session, both the tutor and student can rate each other on a scale of 1-5 stars and leave written reviews. These ratings help build trust in the community.',
            },
            {
                id: 'rr-2',
                question: 'Can I see reviews before booking?',
                answer: 'Absolutely! You can view a tutor\'s average rating, number of reviews, and read individual reviews from past students. This helps you make an informed decision.',
            },
            {
                id: 'rr-3',
                question: 'What if I receive a bad review?',
                answer: 'You can respond to reviews and explain your perspective. If you believe a review is unfair or violates our guidelines, you can report it to our support team.',
            },
            {
                id: 'rr-4',
                question: 'Are reviews anonymous?',
                answer: 'No, reviews show the reviewer\'s name and profile. This ensures accountability and helps build a trustworthy community.',
            },
        ],
    },
    {
        category: 'Safety & Community',
        icon: categoryIcons['Safety & Community'],
        questions: [
            {
                id: 'sc-1',
                question: 'Is my personal information safe?',
                answer: 'Yes! We take privacy seriously. Your personal information is encrypted and only shared with tutors/students you interact with. We never sell your data to third parties.',
            },
            {
                id: 'sc-2',
                question: 'What should I do if I feel unsafe?',
                answer: 'Your safety is our priority. If you feel unsafe or uncomfortable, you can block users, report them, and contact our support team immediately. We have community guidelines to keep everyone safe.',
            },
            {
                id: 'sc-3',
                question: 'Are there community guidelines?',
                answer: 'Yes! All users must follow our community guidelines which promote respect, honesty, and safety. Violations can result in warnings or account suspension.',
            },
            {
                id: 'sc-4',
                question: 'How do I report inappropriate behavior?',
                answer: 'You can report users or sessions through the platform. Click the report button on their profile or session, describe the issue, and our team will investigate.',
            },
        ],
    },
];

export default function FAQPage() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                    <img src="/wibi.png" alt="Wibi Logo" className="h-7 w-7 rounded-md" />
                                </div>
                                <span className="text-xl font-bold text-primary">Wibi</span>
                            </Link>
                        </div>
                        <nav className="hidden md:flex items-center gap-1">
                            <Link href="/marketplace" className="px-4 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Marketplace</Link>
                            <Link href="/how-it-works" className="px-4 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">How It Works</Link>
                            <Link href="/about" className="px-4 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">About</Link>
                        </nav>
                        <div className="flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="bg-primary hover:bg-primary/90">Sign Up</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="w-full py-16 md:py-24 lg:py-32 bg-linear-to-b from-background to-muted/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 text-primary bg-primary/5">
                            FAQ
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                            Frequently Asked <span className="text-primary">Questions</span>
                        </h1>
                        <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl">
                            Find answers to common questions about Wibi, Time Banking, and how to get started.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {faqData.map((category) => (
                            <div key={category.category} className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        {category.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground">{category.category}</h2>
                                </div>
                                <div className="space-y-3">
                                    {category.questions.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group bg-card/50 border border-border/50 rounded-lg hover:border-primary/30 hover:bg-card/80 transition-all duration-200 cursor-pointer overflow-hidden"
                                            onClick={() => toggleExpand(item.id)}
                                        >
                                            <div className="p-4 sm:p-6 flex items-center justify-between">
                                                <h3 className="text-base sm:text-lg font-semibold text-foreground pr-4 group-hover:text-primary transition-colors">{item.question}</h3>
                                                <ChevronDown
                                                    className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                                                        expandedId === item.id ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </div>
                                            {expandedId === item.id && (
                                                <div className="border-t border-border/50 bg-muted/30 px-4 sm:px-6 py-4 animate-in fade-in duration-200">
                                                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{item.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still Have Questions */}
            <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden border-t border-border/40 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center space-y-6 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Still Have <span className="text-primary">Questions</span>?
                        </h2>
                        <p className="mx-auto max-w-[600px] text-muted-foreground text-lg">
                            Can't find the answer you're looking for? Our support team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/contact">
                                <Button size="lg" className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                                    Contact Support
                                </Button>
                            </Link>
                            <Link href="/community/forum">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 border-border hover:bg-muted">
                                    Join Community Forum
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-12 md:py-16 border-t border-border/40">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                    <img src="/wibi.png" alt="Wibi Logo" className="h-5 w-5 rounded-md" />
                                </div>
                                <span className="text-lg font-bold text-primary">Wibi</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Platform peer-to-peer skill exchange untuk pelajar menggunakan sistem Time Banking.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-foreground">Platform</h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">Marketplace</Link>
                                </li>
                                <li>
                                    <Link href="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How It Works</Link>
                                </li>
                                <li>
                                    <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-foreground">Support</h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-foreground">Connect</h4>
                            <div className="flex gap-4">
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                    <span className="sr-only">Facebook</span>
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                    </svg>
                                    <span className="sr-only">Instagram</span>
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                    </svg>
                                    <span className="sr-only">Twitter</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Wibi Time Banking. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
