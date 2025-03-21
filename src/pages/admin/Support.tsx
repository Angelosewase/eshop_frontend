import { useState } from "react";
import {
  Search,
  MessageSquare,
  HelpCircle,
  FileText,
  Mail,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Filter,
  Plus,
} from "lucide-react";
import { PageHeaderWithIcons } from "../../components/custom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Complain } from "../../components/custom/tables/Help&Support/columns";

// Sample data for support tickets
const supportTickets: Array<
  Complain & { status: "open" | "closed" | "pending"; date: string }
> = [
  {
    id: "1",
    customerName: "John Doe",
    email: "john.doe@example.com",
    description:
      "I have a problem with my order #12345. The items I received don't match what I ordered.",
    status: "open",
    date: "2023-06-15",
  },
  {
    id: "2",
    customerName: "Jane Doe",
    email: "jane.doe@example.com",
    description:
      "My order #54321 is delayed by more than a week. Can you please check the status?",
    status: "pending",
    date: "2023-06-12",
  },
  {
    id: "3",
    customerName: "Bob Smith",
    email: "bob.smith@example.com",
    description:
      "I need information about return policy for electronics. Can you provide details?",
    status: "open",
    date: "2023-06-10",
  },
  {
    id: "4",
    customerName: "Alice Johnson",
    email: "alice.johnson@example.com",
    description:
      "The customer service representative was rude during our call. I'd like to file a complaint.",
    status: "closed",
    date: "2023-06-05",
  },
  {
    id: "5",
    customerName: "David Brown",
    email: "david.brown@example.com",
    description:
      "I can't access my account after changing my password. Need urgent help!",
    status: "open",
    date: "2023-06-14",
  },
];

// Sample FAQs
const faqs = [
  {
    question: "How do I track my order?",
    answer:
      "You can track your order by logging into your account and navigating to the 'Orders' section. There you'll find a list of all your orders with their current status and tracking information.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Our standard return policy allows returns within 30 days of purchase. Items must be in their original condition with all tags and packaging. Some exceptions apply for certain product categories.",
  },
  {
    question: "How can I change or cancel my order?",
    answer:
      "You can change or cancel your order within 1 hour of placing it. After that, please contact our customer support team for assistance. Orders that have already been shipped cannot be cancelled.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we offer international shipping to most countries. Shipping rates and delivery times vary by location. You can see the available shipping options during checkout.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password. If you don't receive the email, please check your spam folder.",
  },
];

// Sample knowledge base articles
const knowledgeBaseArticles = [
  {
    id: 1,
    title: "Getting Started with E-shop Admin",
    description: "Learn the basics of using the E-shop admin dashboard",
    category: "Admin Guide",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Managing Product Inventory",
    description: "How to add, edit, and manage your product inventory",
    category: "Products",
    readTime: "8 min",
  },
  {
    id: 3,
    title: "Processing Customer Orders",
    description: "Step-by-step guide to processing and fulfilling orders",
    category: "Orders",
    readTime: "10 min",
  },
  {
    id: 4,
    title: "Setting Up Payment Methods",
    description: "Configure payment gateways and options for your store",
    category: "Payments",
    readTime: "7 min",
  },
  {
    id: 5,
    title: "Customer Management Best Practices",
    description: "Tips for effectively managing customer relationships",
    category: "Customers",
    readTime: "6 min",
  },
  {
    id: 6,
    title: "Analyzing Sales Reports",
    description: "How to interpret and use sales analytics data",
    category: "Analytics",
    readTime: "9 min",
  },
];

function Support() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  const [ticketFilter, setTicketFilter] = useState("all");

  // Toggle FAQ expansion
  const toggleFaq = (index: number) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter((i) => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };

  // Filter tickets based on status
  const filteredTickets = supportTickets.filter((ticket) => {
    if (ticketFilter === "all") return true;
    return ticket.status === ticketFilter;
  });

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Open
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Closed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "closed":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col p-6 min-h-screen">
      <PageHeaderWithIcons title="Help & Support" />

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search for help, articles, FAQs..."
            className="pl-10 py-6 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Support Tickets
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Us
          </TabsTrigger>
        </TabsList>

        {/* Support Tickets Tab */}
        <TabsContent value="tickets" className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <select
                className="border rounded-md px-3 py-1 text-sm"
                value={ticketFilter}
                onChange={(e) => setTicketFilter(e.target.value)}
              >
                <option value="all">All Tickets</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              New Ticket
            </Button>
          </div>

          <div className="space-y-4 flex-1">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden">
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">
                        {ticket.customerName}
                      </CardTitle>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {ticket.email}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {getStatusIcon(ticket.status)}
                    <span>Ticket #{ticket.id}</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-700">{ticket.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 border-t">
                  <span className="text-xs text-gray-500">
                    Created on {new Date(ticket.date).toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm">
                    Reply
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faq" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about our platform and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    {expandedFaqs.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaqs.includes(index) && (
                    <div className="p-4 pt-0 border-t">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {knowledgeBaseArticles.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mb-2">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {article.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-base">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-600">{article.description}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                  >
                    Read Article
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contact Us Tab */}
        <TabsContent value="contact" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as
                    possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input id="name" placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input id="subject" placeholder="How can we help you?" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        className="w-full border rounded-md p-2 resize-none"
                        placeholder="Describe your issue in detail..."
                      ></textarea>
                    </div>
                    <Button className="w-full">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Support</h3>
                      <p className="text-sm text-gray-600">
                        For general inquiries
                      </p>
                      <a
                        href="mailto:support@eshop.com"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        support@eshop.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone Support</h3>
                      <p className="text-sm text-gray-600">
                        Mon-Fri, 9am-5pm EST
                      </p>
                      <a
                        href="tel:+18001234567"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        +1 (800) 123-4567
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Live Chat</h3>
                      <p className="text-sm text-gray-600">Available 24/7</p>
                      <button className="text-blue-600 hover:underline text-sm">
                        Start a chat
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="w-full text-center">
                    <p className="text-sm text-gray-600">
                      Average response time:{" "}
                      <span className="font-medium">2-4 hours</span>
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Support;
