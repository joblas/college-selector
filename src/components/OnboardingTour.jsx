import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function OnboardingTour({ activeTab }) {
  useEffect(() => {
    // Check if onboarding was already completed
    const completed = localStorage.getItem('college_onboarding_done');
    if (completed) return;

    // Only start the tour if we are on the Home tab
    if (activeTab !== 'home') return;

    // Small delay to ensure all DOM elements are rendered
    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        allowClose: true,
        steps: [
          {
            element: '#tour-welcome',
            popover: { 
              title: "Welcome, Kaylani! 👋", 
              description: "Let's take 60 seconds to show you how to build your perfect college roadmap.",
              position: 'bottom' 
            }
          },
          {
            element: '#tour-add-school',
            popover: { 
              title: "Start Your List", 
              description: "Click here to add the colleges you're considering. We'll help you score them automatically.",
              position: 'bottom' 
            }
          },
          {
            element: '#tour-advisor',
            popover: { 
              title: "Your AI Strategy Partner", 
              description: "Need help with admission chances or campus vibes? Your AI Coach is here 24/7.",
              position: 'left' 
            }
          },
          {
            element: '#tour-progress',
            popover: { 
              title: "Track Your Success", 
              description: "Watch this bar fill up as you complete essays, score schools, and win scholarships.",
              position: 'bottom' 
            }
          }
        ],
        onDestroyed: () => {
          localStorage.setItem('college_onboarding_done', 'true');
        }
      });

      driverObj.drive();
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeTab]);

  return null;
}
