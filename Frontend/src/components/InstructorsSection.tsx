import { Award, Medal, Users } from 'lucide-react';

const instructors = [
  {
    name: 'SENSAI ABHISHEK KUMAR TANDAN',
    title: 'Chief Instructor • 3RD Dan',
    bio: 'With over 10 years of dedicated practice, Sensei Abhishek trained in Bhilai. He has led our dojo since its founding and has trained multiple national champions.',
    specialties: ['Traditional Kata', 'Kumite Strategy', 'Philosophy'],
    achievements: ['international Champion 2023', 'Certified Master Instructor', 'National Coach and Judge, KIO "'],
     src: '/coach.jpeg'
    
    
    
  },
  {
    name: 'Renshi  ANJU',
    title: 'Head Instructor • 6th Dan',
    bio: 'with over 40 years of dedicated practice , Renshi Amal trained in Bhilai ',
    specialties: ['Youth Training', 'Competition Prep', 'Self-Defense'],
    achievements: ['Director Pskai India ', 'Youth Coach of the Year 2019'],
    image: '/Sensei Demonstration.jpeg',
  },
  {
    name: 'Shihan TANYA ',
    title: 'Senior Instructor • 5th Dan',
    bio: 'with over 35 years of dedicated practice, Shihan Varun trained in Janjgir .',
    specialties: ['Fitness Training', 'Bunkai Applications', 'Adult Programs'],
    achievements: ['National Team Coach', 'Sports Science MSc', 'Certified Strength Trainer'],
    image: '/sensei-3.jpg',
  },
];

export const InstructorsSection = () => {
  return (
    <section id="instructors" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 block">
            Our Masters
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
            OUR-CLASS <span className="text-gradient-gold">SENSEIS</span>
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mb-8" />
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn from internationally recognized masters with decades of experience in 
            traditional karate and modern training methodologies.
          </p>
        </div>

        {/* Instructors grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {instructors.map((instructor, index) => (
            <div
              key={instructor.name}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500"
            >
              {/* Image placeholder with kanji */}
              <div className="aspect-[4/3] bg-charcoal-light relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-[8rem] text-primary/20 group-hover:text-primary/30 transition-colors duration-300 select-none">
                    {['師', '武', '道'][index]}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Quick stats overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Award className="w-4 h-4 text-secondary" />
                    <span className="font-body text-xs text-foreground">Master</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-body text-xs text-foreground">198+ Students</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-2xl text-foreground mb-1">{instructor.name}</h3>
                <p className="font-body text-sm text-primary mb-4">{instructor.title}</p>
                <p className="font-body text-muted-foreground text-sm leading-relaxed mb-6">
                  {instructor.bio}
                </p>

                {/* Specialties */}
                <div className="mb-6">
                  <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-3">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-accent text-accent-foreground font-body text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-3">Achievements</p>
                  <ul className="space-y-2">
                    {instructor.achievements.map((achievement) => (
                      <li key={achievement} className="flex items-start gap-2">
                        <Medal className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="font-body text-sm text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
