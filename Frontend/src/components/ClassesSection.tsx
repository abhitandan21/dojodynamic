import { Baby, Users, Shield, Award, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const classes = [
  {
    icon: Baby,
    title: 'Little Dragons',
    age: 'Ages 4-7',
    description: 'Fun, engaging classes that introduce young children to martial arts fundamentals while developing coordination, focus, and social skills.',
    features: ['Motor skill development', 'Basic self-defense', 'Confidence building', 'Fun games & activities'],
    color: 'primary',
  },
  {
    icon: Users,
    title: 'Junior Karate',
    age: 'Ages 8-14',
    description: 'Comprehensive training that builds character, discipline, and physical fitness through traditional karate techniques and modern teaching methods.',
    features: ['Traditional kata', 'Sparring introduction', 'Belt progression', 'Anti-bullying skills'],
    color: 'secondary',
  },
  {
    icon: Shield,
    title: 'Adult Karate',
    age: 'Ages 15+',
    description: 'Whether beginner or advanced, develop your skills in a supportive environment that challenges both body and mind.',
    features: ['Full curriculum', 'Fitness conditioning', 'Stress relief', 'Competition optional'],
    color: 'primary',
  },
  {
    icon: Award,
    title: 'Competition Team',
    age: 'By Invitation',
    description: 'Elite training program for dedicated practitioners who wish to compete at regional, national, and international tournaments.',
    features: ['Advanced techniques', 'Tournament strategy', 'Mental preparation', 'Travel opportunities'],
    color: 'secondary',
  },
];

const beltLevels = [
  { belt: 'White', meaning: 'Pure beginning', color: 'bg-white border border-border' },
  { belt: 'Yellow', meaning: 'Rising sun', color: 'bg-yellow-400' },
  { belt: 'Orange', meaning: 'Growing strength', color: 'bg-orange-500' },
  { belt: 'Green', meaning: 'Developing skill', color: 'bg-green-600' },
  { belt: 'Blue', meaning: 'Deepening knowledge', color: 'bg-blue-600' },
  { belt: 'Purple', meaning: 'Wisdom emerging', color: 'bg-purple-600' },
  { belt: 'Brown', meaning: 'Maturity', color: 'bg-amber-800' },
  { belt: 'Black', meaning: 'Mastery begins', color: 'bg-black border border-border' },
];

export const ClassesSection = () => {
  return (
    <section id="classes" className="py-24 bg-gradient-dark relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 block">
            Training Programs
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
            FIND YOUR <span className="text-gradient-crimson">PATH</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8" />
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            From young beginners to seasoned practitioners, we offer programs tailored to every 
            age group and skill level.
          </p>
        </div>

        {/* Classes grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {classes.map((classItem, index) => (
            <div
              key={classItem.title}
              className="group bg-card rounded-xl p-8 border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  classItem.color === 'primary' 
                    ? 'bg-primary/10 group-hover:bg-primary/20' 
                    : 'bg-secondary/10 group-hover:bg-secondary/20'
                } transition-colors duration-300`}>
                  <classItem.icon className={`w-8 h-8 ${
                    classItem.color === 'primary' ? 'text-primary' : 'text-secondary'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-2xl text-foreground">{classItem.title}</h3>
                    <span className={`px-3 py-1 rounded-full font-body text-xs ${
                      classItem.color === 'primary'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary/20 text-secondary'
                    }`}>
                      {classItem.age}
                    </span>
                  </div>
                  <p className="font-body text-muted-foreground mb-4">{classItem.description}</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {classItem.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <ArrowRight className={`w-3 h-3 ${
                          classItem.color === 'primary' ? 'text-primary' : 'text-secondary'
                        }`} />
                        <span className="font-body text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Belt progression */}
        <div className="bg-card rounded-xl p-8 border border-border">
          <h3 className="font-display text-3xl text-center text-foreground mb-8">BELT PROGRESSION</h3>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {beltLevels.map((level, index) => (
              <div key={level.belt} className="flex flex-col items-center group">
                <div className={`w-16 h-4 ${level.color} rounded-sm mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300`} />
                <span className="font-body text-sm text-foreground">{level.belt}</span>
                <span className="font-body text-xs text-muted-foreground">{level.meaning}</span>
                {index < beltLevels.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground mt-2 hidden sm:block rotate-0 sm:rotate-0" />
                )}
              </div>
            ))}
          </div>
          <p className="font-body text-center text-muted-foreground max-w-2xl mx-auto">
            Our belt system follows the traditional Shito Ryu  progression, with regular testing 
            opportunities and clear requirements for advancement.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            variant="default" 
            size="xl"
            onClick={() => {
              const element = document.querySelector('#contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Book a Free Trial Class
          </Button>
        </div>
      </div>
    </section>
  );
};
