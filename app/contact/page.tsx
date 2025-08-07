import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import Navbar from "@/components/layout/Navbar";

const Contact = () => {
  return (
    <>
      <Navbar />
      <Card
        className="w-full max-w-md mx-auto mt-12 text-center border border-black/5 dark:border-white/10 bg-white dark:bg-[rgba(255,255,255,0.03)] 
        backdrop-blur-sm shadow-md rounded-2xl transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]"
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Get in Touch</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            I&apos;m always open to connecting with fellow developers and creators.
          </p>
          <Button asChild className="w-full mb-8">
            <a
              href="https://github.com/binay-das"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-5 w-5" />
              Binay Das
            </a>
          </Button>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Or, drop me an email</h3>
            <p className="text-muted-foreground">
              Whether you have a question or just want to say hi, I&apos;ll try my
              best to get back to you!
            </p>
            <div className="flex items-center justify-center rounded-lg border border-border bg-muted/30 dark:bg-white/5 p-3">
              <Mail className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="flex-grow text-left font-mono text-sm">
                binaydas.work@gmail.com
              </span>
              <CopyButton text="binaydas.work@gmail.com" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Contact;
