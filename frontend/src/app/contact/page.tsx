'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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
                            Contact Us
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                            Get in <span className="text-primary">Touch</span>
                        </h1>
                        <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl">
                            Have a question or feedback? We'd love to hear from you. Our support team is here to help.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                                <p className="text-muted-foreground mb-8">
                                    Reach out to us through any of these channels. We typically respond within 24 hours.
                                </p>
                            </div>

                            {/* Email */}
                            <div className="bg-card/50 border border-border/50 rounded-lg p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-200">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 flex-shrink-0">
                                        <Mail className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Email</h3>
                                        <p className="text-sm text-muted-foreground mt-1">halo@wibi.com</p>
                                        <p className="text-xs text-muted-foreground mt-2">We'll respond within 24 hours</p>
                                    </div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="bg-card/50 border border-border/50 rounded-lg p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-200">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 flex-shrink-0">
                                        <Phone className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Phone</h3>
                                        <p className="text-sm text-muted-foreground mt-1">+62 812-9510-1836</p>
                                        <p className="text-xs text-muted-foreground mt-2">Monday - Friday, 9AM - 5PM WIB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="bg-card/50 border border-border/50 rounded-lg p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-200">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 flex-shrink-0">
                                        <MapPin className="h-6 w-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Location</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Bogor, Indonesia</p>
                                        <p className="text-xs text-muted-foreground mt-2">Serving students nationwide</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-card/50 border border-border/50 rounded-lg p-6 sm:p-8">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-foreground">Send us a Message</h3>
                                    <p className="text-muted-foreground mt-2">
                                        Fill out the form below and we'll get back to you as soon as possible.
                                    </p>
                                </div>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Full Name
                                            </label>
                                            <Input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Your full name"
                                                className="bg-muted/50"
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Email Address
                                            </label>
                                            <Input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="your@email.com"
                                                className="bg-muted/50"
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Subject
                                            </label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-border rounded-lg bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="bug">Report a Bug</option>
                                                <option value="feature">Feature Request</option>
                                                <option value="support">Technical Support</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Tell us what's on your mind..."
                                                rows={6}
                                                className="w-full px-3 py-2 border border-border rounded-lg bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 resize-none"
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="animate-spin mr-2">⏳</span>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ CTA */}
            <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden border-t border-border/40 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center space-y-6 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Looking for Quick <span className="text-primary">Answers</span>?
                        </h2>
                        <p className="mx-auto max-w-[600px] text-muted-foreground text-lg">
                            Check out our FAQ page for answers to common questions about Wibi and Time Banking.
                        </p>
                        <Link href="/faq">
                            <Button size="lg" className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                                Visit FAQ
                            </Button>
                        </Link>
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
