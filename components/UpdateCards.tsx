import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
// import heroDashboard from "@/assets/hero-dashboard.jpg";

const UpdateCards = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 bg-secondary border-none hover:shadow-xl transition-shadow">
            <div className="space-y-4">
              <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Latest
              </span>
              <h3 className="text-2xl font-bold text-foreground">
                A Fresh Way to Stay Connected
              </h3>
              <p className="text-muted-foreground">
                Stay connected across devices with a seamless messaging
                experience, wherever you are.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-primary gap-2 group"
              >
                Learn what's new on Messagey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>

          <Card className="p-8 bg-feature-blue border-none hover:shadow-xl transition-shadow">
            <div className="space-y-4">
              <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Updates
              </span>
              <h3 className="text-2xl font-bold text-foreground">
                Dark Mode Customization
              </h3>
              <p className="text-muted-foreground">
                Personalize your experience with new themes and color accents to
                make dark mode easier on your eyes.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-primary gap-2 group mb-4"
              >
                Learn about Messagey updates
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              {/* <Image
                src={heroDashboard}
                alt="Dark mode interface preview"
                className="w-full rounded-lg shadow-lg"
              /> */}
              <div className="w-full rounded-lg shadow-lg bg-primary"></div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UpdateCards;
