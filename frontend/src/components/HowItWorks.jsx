import React from 'react';
import { BriefcaseIcon, UserPlusIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    icon: <UserPlusIcon className="h-10 w-10 text-primary-500 mx-auto" />,
    title: 'Sign Up',
    desc: 'Create your free account in seconds.'
  },
  {
    icon: <BriefcaseIcon className="h-10 w-10 text-primary-500 mx-auto" />,
    title: 'Browse Jobs',
    desc: 'Explore jobs from top companies tailored for you.'
  },
  {
    icon: <PaperAirplaneIcon className="h-10 w-10 text-primary-500 mx-auto" />,
    title: 'Apply Easily',
    desc: 'Submit your application with just a few clicks.'
  }
];

const HowItWorks = () => (
  <section className="py-8 md:py-12" style={{ backgroundColor: '#bae6fd' }}>
    <div className="container mx-auto px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-primary-900">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 text-center border-2 border-primary-100 hover:border-primary-400 transition-all duration-300">
            {step.icon}
            <h3 className="text-xl font-semibold mt-4 mb-2 text-primary-800">{step.title}</h3>
            <p className="text-primary-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks; 