import { Award, Medal, Users } from 'lucide-react';

const instructors = [

   {
    name: 'Renshi AMOL TALUKDAR',
    title: 'Secretary CGKDA • 6th Dan',
    bio: 'With over 40 years of dedicated practice.',
    specialties: ['Youth Training', 'Competition Prep', 'Self-Defense'],
    achievements: ['Director Pskai India', 'Youth Coach of the Year 2019'],
    image: '/amol.jpeg',
  },



  {
    name: 'SENSAI ABHISHEK KUMAR TANDAN',
    title: 'Chief Instructor • 3RD Dan',
    bio: 'With over 10 years of dedicated practice, Sensei Abhishek trained in Bhilai.',
    specialties: ['Traditional Kata', 'Kumite Strategy', 'Philosophy'],
    achievements: ['International Champion 2023', 'Certified Master Instructor'],
    image: '/coach.jpeg',
  },
 
  {
    name: 'MR. GHANSHAYAM DEWANGAN ',
    title: 'Petron of Amaasa ',
    bio: 'Social Worker ',
    specialties: ['Social Worker', 'Speaker ', ''],
    achievements: ['Sport Player', ''],
    image: '/petron.jpeg',
  },
];

export const InstructorsSection = () => {
  return (
    <section id="instructors" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {instructors.map((instructor) => (
            <div
              key={instructor.name}
              className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500"
            >

              {/* ✅ IMAGE ADDED */}
              <div className="h-64 overflow-hidden">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold">{instructor.name}</h3>
                <p className="text-primary text-sm mb-3">{instructor.title}</p>
                <p className="text-gray-400 text-sm mb-4">{instructor.bio}</p>

                {/* Specialties */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map((s) => (
                      <span key={s} className="px-2 py-1 bg-gray-800 text-xs rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <ul className="space-y-1">
                  {instructor.achievements.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-gray-400">
                      <Medal className="w-4 h-4 text-yellow-500" />
                      {a}
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};