"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Upload,
  Shield,
  ArrowRight,
  CheckCircle,
  FolderOpen,
  Play,
  Globe
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  const features = [
    {
      icon: <Upload className="h-5 w-5" />,
      title: "Quick Upload",
      description: "Drop files anywhere or click to browse",
      accent: "border-l-blue-400",
    },
    {
      icon: <FolderOpen className="h-5 w-5" />,
      title: "Smart Organization",
      description: "Create folders and organize with ease",
      accent: "border-l-green-400",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Your Data, Secured",
      description: "Secured data, for peace of mind",
      accent: "border-l-purple-400",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Access Anywhere",
      description: "Available on web, mobile, and desktop",
      accent: "border-l-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <section className="pt-16 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="inline-block">
              <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:bg-blue-950">
                Cloudify
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
              A place for your files.
              <br />
              <span className="text-blue-500">Nothing more, nothing less.</span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Upload your files, organize them in folders, and access them from
              anywhere. That&apos;s it. No complex features, no overwhelming
              interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signin">
                <Button className="bg-blue-500 hover:bg-blue-600 px-6 py-2">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="px-6 py-2 border-gray-200 dark:border-gray-700"
              >
                <Play className="mr-2 h-4 w-4" />
                See How It Works
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16"
          >
            <div className="bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="ml-4 bg-white dark:bg-slate-800 rounded px-3 py-1 text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                  app.cloudify.com
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-gray-700 h-48 flex items-center justify-center">
                <div className="text-center">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Your files will appear here
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50/50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Built for simplicity
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              We focus on what matters most: making file storage straightforward
              and reliable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`border-0 border-l-4 ${feature.accent} shadow-none bg-white dark:bg-slate-900 rounded-none rounded-r-lg hover:shadow-sm transition-shadow`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Why we built this
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Most cloud storage services are bloated with features you don&apos;t
                need. We believe file storage should be simple, fast, and
                reliable.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Upload your files, organize them however you want, and access
                them from any device. That&apos;s what Cloudify does best.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {[
                "No unnecessary features",
                "Clean, minimal interface",
                "Fast uploads and downloads",
                "Works on any device",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-50 dark:bg-blue-950/20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Ready to try it out?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Create your account and start uploading files in under a minute.
            </p>
            <Link href="/signup">
              <Button className="bg-blue-500 hover:bg-blue-600 px-6 py-2">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
