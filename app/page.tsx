import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Clock, Edit3, FileText, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-center">
          <div className="flex items-center font-semibold gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>CV Maker</span>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-8">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
              <div className="flex flex-col gap-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Craft the perfect resume in minutes
                </h1>
                <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                  Create professional, ATS-friendly resumes that stand out. Our intelligent platform helps you showcase
                  your skills and experience effectively.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/templates">
                    <Button size="lg" className="px-8">
                      Create Your Resume
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div id="hero" className="relative rounded-lg border bg-background p-2 shadow-lg">
                  <Image
                    src="/3.jpg"
                    alt="Resume preview"
                    width={800}
                    height={600}
                    className="rounded border shadow-sm"
                  />
                  {/* <div className="absolute -right-4 -top-4 rounded-full bg-primary p-2 text-primary-foreground shadow-lg">
                    <Edit3 className="h-5 w-5" />
                  </div> */}
                </div>
                <div className="absolute -bottom-6 -left-6 rounded-lg border bg-background p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">ATS-Optimized</span>
                  </div>
                </div>
                <div className="absolute -right-6 top-1/2 rounded-lg border bg-background p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Ready within secs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Craft your career story with precision
              </h2>
              <p className="mt-4 max-w-[700px] text-lg text-muted-foreground">
                Our intelligent platform offers everything you need to create a compelling resume that gets results.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 justify-center">
              {[
                {
                  icon: <Edit3 className="h-10 w-10 text-primary" />,
                  title: "Intuitive Editor",
                  description:
                    "Our drag-and-drop editor makes creating and updating your resume effortless and enjoyable.",
                },
                {
                  icon: <FileText className="h-10 w-10 text-primary" />,
                  title: "ATS-Optimized Templates",
                  description:
                    "Professionally designed templates that pass Applicant Tracking Systems and catch recruiters' eyes.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 rounded-lg border bg-background shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 rounded-full bg-primary/10 p-3">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Three simple steps to your perfect resume
              </h2>
              <p className="mt-4 max-w-[800px] text-lg text-muted-foreground">
                Our streamlined process helps you create a professional resume in seconds, not hours.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 px-10">
              {[
              {
                step: "01",
                title: "Add your details",
                description:
                "Fill in your information with our easy-to-use editor and AI-powered content suggestions.",
              },
              {
                step: "02",
                title: "Download and share",
                description: "Export your resume in multiple formats and start applying to jobs with confidence.",
              },
              ].map((step, index) => (
              <div key={index} className="relative flex flex-col p-6">
                <div className="text-6xl font-bold text-primary/10 absolute -top-2 left-0">{step.step}</div>
                <h3 className="text-xl font-bold mt-8">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
                {index < 2 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-muted-foreground/50" />
                </div>
                )}
              </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section
        <section className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Trusted by professionals worldwide
              </h2>
              <p className="mt-4 max-w-[700px] text-lg text-muted-foreground">
                See what our users have to say about their experience with ResumeForge.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  name: "Alex Johnson",
                  role: "Software Engineer",
                  content:
                    "ResumeForge helped me land interviews at top tech companies. The ATS-optimized templates and AI suggestions made all the difference.",
                },
                {
                  name: "Sarah Williams",
                  role: "Marketing Director",
                  content:
                    "I was able to create a stunning resume in less than 20 seconds. The intuitive editor and professional templates exceeded my expectations.",
                },
                {
                  name: "Michael Chen",
                  role: "Recent Graduate",
                  content:
                    "As a recent graduate with limited experience, ResumeForge helped me highlight my skills and achievements in the best possible way.",
                },
              ].map((testimonial, index) => (
                <div key={index} className="flex flex-col p-6 rounded-lg border bg-background shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                  </div>
                  <p className="flex-1 text-muted-foreground">"{testimonial.content}"</p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=40&width=40&text=${testimonial.name[0]}`}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Pricing Section
        <section id="pricing" className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 max-w-[700px] text-lg text-muted-foreground">
                Choose the plan that works best for your career needs.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  name: "Free",
                  price: "$0",
                  description: "Perfect for trying out our platform",
                  features: ["1 resume template", "Basic editor features", "PDF downloads", "7-day access"],
                },
                {
                  name: "Premium",
                  price: "$12",
                  description: "Everything you need for your job search",
                  features: [
                    "All resume templates",
                    "Advanced editor features",
                    "AI content suggestions",
                    "Multiple export formats",
                    "Cover letter builder",
                    "30-day access",
                  ],
                  popular: true,
                },
                {
                  name: "Professional",
                  price: "$29",
                  description: "For serious career advancement",
                  features: [
                    "All Premium features",
                    "LinkedIn profile optimization",
                    "Priority support",
                    "Resume performance analytics",
                    "Unlimited access",
                  ],
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`flex flex-col p-6 rounded-lg border ${plan.popular ? "border-primary shadow-lg relative" : "bg-background shadow-sm"}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.name !== "Free" && <span className="ml-1 text-muted-foreground">/month</span>}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <ul className="flex-1 mb-6 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                    {plan.name === "Free" ? "Get Started" : "Subscribe Now"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* FAQ Section
        <section id="faq" className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently asked questions
              </h2>
              <p className="mt-4 max-w-[700px] text-lg text-muted-foreground">
                Find answers to common questions about ResumeForge.
              </p>
            </div>
            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How does ResumeForge help with ATS optimization?",
                    answer:
                      "Our templates are designed to be ATS-friendly, with clean layouts and proper formatting. We also provide keyword suggestions based on job descriptions to help your resume pass through Applicant Tracking Systems.",
                  },
                  {
                    question: "Can I create multiple resumes?",
                    answer:
                      "Yes, all paid plans allow you to create multiple resumes. This is perfect for tailoring your resume to different job applications or industries.",
                  },
                  {
                    question: "How do the AI content suggestions work?",
                    answer:
                      "Our AI analyzes your input and job descriptions to suggest impactful bullet points, skills, and achievements that highlight your experience effectively and match what employers are looking for.",
                  },
                  {
                    question: "What file formats can I download my resume in?",
                    answer:
                      "You can download your resume as a PDF, DOCX, or TXT file. Premium and Professional plans also include options for web-based resumes and direct sharing to LinkedIn.",
                  },
                  {
                    question: "Is my data secure?",
                    answer:
                      "Yes, we take data security seriously. All your information is encrypted and stored securely. We never share your personal data with third parties without your consent.",
                  },
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to transform your career?
              </h2>
              <p className="mt-4 max-w-[700px] text-lg text-muted-foreground">
                Join thousands of professionals who have boosted their job search with ResumeForge.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/templates">
                    <Button size="lg" className="px-8">
                      Create Your Resume
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-semibold">
                <FileText className="h-5 w-5 text-primary" />
                <span>CV Maker</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Craft the perfect resume in seconds with our intuitive platform.
              </p>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CV Maker. 
          <p className="text-xs text-muted-foreground opacity-30 mt-4 text-right">
            <a
              href="https://www.harsyax1.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              www.harsyax1.com
            </a>
          </p>
          </div>
        </div>
        <div className="mt-4 text-right">
          
        </div>
      </footer>
    </div>
  )
}
