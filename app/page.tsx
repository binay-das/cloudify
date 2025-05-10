"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  FileCheck,
  Fingerprint,
  FolderSearch,
  Globe,
  History,
  Lock,
  Notebook,
  Quote,
  Share2,
  Shield,
  Smartphone,
  Upload,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const features = [
  {
    title: "Secure Storage",
    description:
      "End-to-end encryption keeps your files completely private and secure.",
    icon: <Lock />,
    color: "text-chart-1",
  },
  {
    title: "Access Anywhere",
    description:
      "Seamlessly access your files from any device, anywhere in the world.",
    icon: <Smartphone />,
    color: "text-chart-2",
  },
  {
    title: "Version History",
    description:
      "Track changes and restore previous versions of your files with ease.",
    icon: <History />,
    color: "text-chart-3",
  },
  {
    title: "Smart Search",
    description:
      "Find any file instantly with our powerful search capabilities.",
    icon: <FolderSearch />,
    color: "text-chart-4",
  },
  {
    title: "Easy Sharing",
    description:
      "Share files and folders with anyone through secure links and permissions.",
    icon: <Share2 />,
    color: "text-chart-5",
  },
  {
    title: "Lightning Fast",
    description:
      "Experience rapid uploads and downloads with our optimized infrastructure.",
    icon: <Zap />,
    color: "text-chart-1",
  },
  {
    title: "File Recovery",
    description:
      "Never lose important data with automatic backup and recovery options.",
    icon: <FileCheck />,
    color: "text-chart-2",
  },
  {
    title: "Advanced Security",
    description:
      "Multi-factor authentication and breach detection keep your account safe.",
    icon: <Fingerprint />,
    color: "text-chart-4",
  },
];

const testimonials = [
  {
    content:
      "Cloudify has completely transformed how our team collaborates. The intuitive interface and powerful sharing features have made our workflow so much smoother.",
    author: "Sarah Johnson",
    role: "Creative Director, DesignHub",
    avatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100",
    initials: "SJ",
  },
  {
    content:
      "The security features in Cloudify give me peace of mind when handling sensitive client documents. It&#39;s reliable, fast, and incredibly easy to use.",
    author: "Michael Chen",
    role: "Financial Advisor, WealthWise",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
    initials: "MC",
  },
  {
    content:
      "As someone who works across multiple devices, Cloudifys seamless sync is a game-changer. I can start work on my laptop and continue on my phone without missing a beat.",
    author: "Emily Rodriguez",
    role: "Remote Project Manager",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
    initials: "ER",
  },
  {
    content:
      "Weve tried many storage solutions, but Cloudify stands out with its balance of powerful features and user-friendly design. Our entire team adopted it within days.",
    author: "Thomas Wright",
    role: "CTO, TechStart",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100",
    initials: "TW",
  },
];

export default function Home() {
  return (
    <div>
      <section className="flex lg:flex-row flex-col justify-center items-center gap-12 pt-24 sm:pt-32 min-h-screen px-8">
        <div className="flex flex-col gap-8 max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Your files, secure, structured and accessible everywhere.
          </h1>
          <p className="text-lg text-muted-foreground">
            Cloudify helps you store, share, and collaborate on files with
            unmatched security and simplicity. Access your content from any
            device, anywhere in the world.
          </p>

          <div className="flex gap-4">
            <Button size={"lg"} className="">
              Start for free
              <ArrowRight />
            </Button>
            <Button size={"lg"} variant={"secondary"} className="">
              Read docs
              <Notebook />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-chart-2" />
              <span>End-to-end encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-chart-1" />
              <span>Up to 2GB free storage</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-chart-4" />
              <span>Access anywhere</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col max-w-xl">
          <Image
            alt="img"
            src={
              "https://static.vecteezy.com/system/resources/previews/029/455/013/non_2x/businesswoman-using-laptop-computer-upload-file-and-download-information-data-on-cloud-computing-technology-network-work-from-home-concept-illustration-vector.jpg"
            }
            width={500}
            height={500}
          />
        </div>
      </section>

      <section className="py-20 mx-auto px-4 bg-muted/30 border">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything that you need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cloudify combines powerful features with an intuitive interface,
            making file management simpler than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="h-full transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
            >
              <CardHeader className="flex items-center gap-4">
                <div
                  className={`${feature.color} p-2 rounded-md inline-flex bg-muted`}
                >
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground/80">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 mx-auto bg-muted/30">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by thousands
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here's what our customers have to say about their experience with
            Cloudify.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <Card key={testimonial.author} className="h-full">
              <CardContent className="pt-6 flex flex-col h-full">
                <Quote className="h-8 w-8 text-primary/40 mb-4" />

                <p className="text-lg mb-6 flex-grow">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.author}
                    />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
