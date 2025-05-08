import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Notebook, Shield, Upload } from "lucide-react";
import Image from "next/image";

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
    </div>
  );
}
