import { Clock, MapPin, Check } from 'lucide-react';
import { Button } from './ui/button';

const schedule = [
  {
    day: 'Monday',
    classes: [
      { time: '4:00 PM', name: 'Little Dragons', duration: '45 min' },
      { time: '5:00 PM', name: 'Junior Karate', duration: '60 min' },
      { time: '6:30 PM', name: 'Adult Beginners', duration: '90 min' },
      { time: '8:00 PM', name: 'Advanced Training', duration: '90 min' },
    ],
  },
  {
    day: 'Tuesday',
    classes: [
      { time: '5:00 PM', name: 'Junior Karate', duration: '60 min' },
      { time: '6:30 PM', name: 'Adult All Levels', duration: '90 min' },
      { time: '8:00 PM', name: 'Competition Team', duration: '120 min' },
    ],
  },
  {
    day: 'Wednesday',
    classes: [
      { time: '4:00 PM', name: 'Little Dragons', duration: '45 min' },
      { time: '5:00 PM', name: 'Junior Karate', duration: '60 min' },
      { time: '6:30 PM', name: 'Self-Defense', duration: '60 min' },
      { time: '7:30 PM', name: 'Adult Karate', duration: '90 min' },
    ],
  },
  {
    day: 'Thursday',
    classes: [
      { time: '5:00 PM', name: 'Junior Karate', duration: '60 min' },
      { time: '6:30 PM', name: 'Adult All Levels', duration: '90 min' },
      { time: '8:00 PM', name: 'Black Belt Class', duration: '90 min' },
    ],
  },
  {
    day: 'Friday',
    classes: [
      { time: '4:00 PM', name: 'Little Dragons', duration: '45 min' },
      { time: '5:00 PM', name: 'Junior Sparring', duration: '60 min' },
      { time: '6:30 PM', name: 'Open Training', duration: '90 min' },
    ],
  },
  {
    day: 'Saturday',
    classes: [
      { time: '9:00 AM', name: 'Family Class', duration: '60 min' },
      { time: '10:30 AM', name: 'Competition Team', duration: '120 min' },
      { time: '1:00 PM', name: 'Adult Intensive', duration: '120 min' },
    ],
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 400 ,
    period: '/month',
    description: 'Perfect for beginners testing the waters',
    features: ['Personality Development ClasS', 'Free uniform (gi)', 'Basic equipment access', 'Monthly progress report'],
    popular: false,
  },
  {
    name: 'Warrior',
    price: 500,
    period: '/month',
    description: 'Most popular for serious students',
    features: ['Unlimited classes', 'Free uniform (gi)', 'Full equipment access', 'Sparring gear included', 'Priority belt testing', 'Access to workshops'],
    popular: true,
  },
  {
    name: 'Family',
    price: 700,
    period: '/month',
    description: 'Train together, grow together',
    features: ['Up to 4 family members', 'Unlimited classes', 'All equipment included', 'Family discount on events', 'Private family session/month'],
    popular: false,
  },
];

export const ScheduleSection = () => {
  return (
    <section id="schedule" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 block">
            Schedule & Pricing
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
            TRAIN ON YOUR <span className="text-gradient-gold">TERMS</span>
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mb-8" />
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible schedules and transparent pricing designed to fit your lifestyle.
          </p>
        </div>

        {/* Schedule grid */}
        <div className="mb-20 overflow-x-auto">
          <div className="min-w-[800px] grid grid-cols-6 gap-4">
            {schedule.map((day) => (
              <div key={day.day} className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="bg-primary/10 p-4 text-center">
                  <h3 className="font-display text-lg text-foreground">{day.day}</h3>
                </div>
                <div className="p-4 space-y-3">
                  {day.classes.map((classItem, index) => (
                    <div
                      key={index}
                      className="bg-accent/50 rounded-lg p-3 hover:bg-accent transition-colors duration-300"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3 h-3 text-primary" />
                        <span className="font-body text-xs text-primary font-semibold">{classItem.time}</span>
                      </div>
                      <p className="font-body text-sm text-foreground font-medium">{classItem.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{classItem.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location info */}
        <div className="flex items-center justify-center gap-6 mb-16 text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="font-body">Pragati Nagar Risali Bhilai </span>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-xl p-8 border transition-all duration-300 hover:-translate-y-2 ${
                plan.popular ? 'border-primary shadow-crimson' : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground font-body text-xs uppercase tracking-wider px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="font-display text-2xl text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="font-display text-5xl text-foreground">{plan.price}</span>
                  <span className="font-body text-muted-foreground">{plan.period}</span>
                </div>
                <p className="font-body text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="font-body text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? 'default' : 'outline'}
                className="w-full"
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
