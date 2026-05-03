import { Shield, Heart, Target, Award } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Discipline',
    description: 'Cultivate mental fortitude and self-control through rigorous training and mindful practice.',
  },
  {
    icon: Heart,
    title: 'Respect',
    description: 'Honor the traditions of martial arts and treat every practitioner with dignity and humility.',
  },
  {
    icon: Target,
    title: 'Focus',
    description: 'Develop unwavering concentration that extends beyond the dojo into every aspect of life.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Strive for continuous improvement and mastery in technique, spirit, and character.',
  },
];

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-gradient-dark relative">
      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 block">
            Our Philosophy
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
            THE WAY OF THE <span className="text-gradient-crimson">WARRIOR</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8" />
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Founded in 2021, AMAASA has been a sanctuary for martial artists seeking authentic
            Karate training. Our lineage traces directly to PASKAI INDIA, KIO, WKF, where our founding
            sensei trained under legendary masters for over two decades.
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image/Visual side */}
          <div className="relative">
            <div className="aspect-[4/5] bg-card rounded-lg overflow-hidden shadow-elegant">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
              <div className="absolute inset-0 flex items-center justify-center">
                {/*<span className="font-display text-[15rem] text-primary/10 select-none">道</span>*/}
               <img src="/C2.jpeg" alt="Banner" className="h-full w-full object-cover" />

              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                {/*<blockquote className="font-body text-lg italic text-foreground/90">
                  "The ultimate aim of karate lies not in victory or defeat, but in the perfection of 
                  the character of its participants."
                </blockquote>
                <cite className="font-body text-sm text-muted-foreground mt-4 block">
                  — Director of AMAASA
                </cite>*/}
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-primary" />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-secondary" />
          </div>

          {/* Content side */}
          <div>
            <h3 className="font-display text-3xl text-foreground mb-6">
              MORE THAN A MARTIAL ART
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              At AMAASA Dojo, we believe karate is a path to self-discovery. Our training goes beyond
              physical techniques—we nurture mental strength, emotional resilience, and spiritual growth
              in every student who walks through our doors.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Whether you're a complete beginner or an experienced martial artist, our comprehensive
              curriculum adapts to your skill level while challenging you to reach new heights. From
              traditional kata to practical self-defense, we provide a complete martial arts education.
            </p>

            {/* Certificates */}
            <div className="grid grid-cols-2 gap-6">

              <div className="bg-card p-6 rounded-lg border border-border text-center">
                <img src="/aff1.jpeg" alt="Banner" className="h-full w-full object-cover" />

                <p className="font-body text-sm text-muted-foreground">
                  Affiliation Certificate
                </p>
              </div>

              {/*<div className="bg-card p-6 rounded-lg border border-border text-center">
                <img
                  src="../public/aff1.jpeg"
                  alt="MSME Certificate"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <p className="font-body text-sm text-muted-foreground">
                  MSME Certificate
                </p>
              </div>*/}

            </div>
          </div>


        </div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="group bg-card p-8 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <value.icon className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-display text-xl text-foreground mb-3">{value.title}</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
