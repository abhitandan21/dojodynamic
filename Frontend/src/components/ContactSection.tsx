import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface FormData {
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  program?: string;
  message?: string;
}

export const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    program: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\d\s\-+()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.program) {
      newErrors.program = 'Please select a program';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Thank you! We\'ll be in touch soon.');

    // Reset form after delay
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', program: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const contactInfo = [
    { icon: MapPin, label: 'Location', value: 'Pragati Nagar Risali Bhilai C.G ' },
    { icon: Phone, label: 'Phone', value: '7898764542' },
    { icon: Mail, label: 'Email', value: 'abhishekmartialartsandsportsac@gamil.com' },
    { icon: Clock, label: 'Hours', value: 'Mon-Sat: 4PM-9PM' },
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-dark relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 block">
            Contact Us
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
            BEGIN YOUR <span className="text-gradient-crimson">JOURNEY</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8" />
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your life through martial arts? Book your free trial class today 
            and experience the Dragon Dojo difference.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact form */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-elegant">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-2">Message Sent!</h3>
                <p className="font-body text-muted-foreground">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block font-body text-sm text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-background border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${
                        errors.name ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="Student Name"
                    />
                    {errors.name && (
                      <p className="font-body text-xs text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block font-body text-sm text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-background border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${
                        errors.email ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="Student Gmail"
                    />
                    {errors.email && (
                      <p className="font-body text-xs text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block font-body text-sm text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-background border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${
                        errors.phone ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="7898764542"
                    />
                    {errors.phone && (
                      <p className="font-body text-xs text-destructive mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Program */}
                  <div>
                    <label htmlFor="program" className="block font-body text-sm text-foreground mb-2">
                      Program Interest *
                    </label>
                    <select
                      id="program"
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-background border rounded-lg font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${
                        errors.program ? 'border-destructive' : 'border-border'
                      }`}
                    >
                      <option value="">Select a program</option>
                      <option value="little-dragons">Little Dragons (4-7)</option>
                      <option value="junior">Junior Karate (8-14)</option>
                      <option value="adult">Adult Karate (15+)</option>
                      <option value="competition">Competition Team</option>
                      <option value="self-defense">Self-Defense</option>
                      <option value="family">Family Program</option>
                    </select>
                    {errors.program && (
                      <p className="font-body text-xs text-destructive mt-1">{errors.program}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block font-body text-sm text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 bg-background border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 resize-none ${
                      errors.message ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="Tell us about your goals and any experience you have..."
                  />
                  {errors.message && (
                    <p className="font-body text-xs text-destructive mt-1">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Contact info & map */}
          <div className="space-y-8">
            {/* Contact cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="bg-card rounded-lg p-6 border border-border hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className="font-body text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="aspect-video bg-card rounded-xl border border-border overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="font-display text-8xl text-primary/20">地</span>
                  <p className="font-body text-muted-foreground mt-4">Interactive Map</p>
                  <p className="font-body text-sm text-muted-foreground">123 Warrior Way, Martial City</p>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <p className="font-display text-4xl text-primary mb-2">4.9★</p>
              <p className="font-body text-muted-foreground text-sm">Based on 198+ Google Reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
