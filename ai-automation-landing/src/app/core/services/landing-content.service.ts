import { Injectable } from '@angular/core';

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaLink: string;
  highlighted?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LandingContentService {
  readonly bookingUrl = 'https://calendly.com/your-handle/discovery-call';
  readonly kitCheckoutUrl = 'https://checkout.example.com/ai-agent-starter-kit';

  getProblemPoints(): string[] {
    return [
      'Manual workflows slow down delivery and create bottlenecks.',
      'Teams struggle to connect tools, data, and AI agents reliably.',
      'Most automations break when ownership and architecture are unclear.'
    ];
  }

  getSolutionPoints(): string[] {
    return [
      'Production-ready AI agent workflows aligned to your process.',
      'Clear architecture, observability, and handoff documentation.',
      'Fast implementation with reusable templates and components.'
    ];
  }

  getPricingPlans(): PricingPlan[] {
    return [
      {
        name: 'Starter',
        price: '$1,500',
        description: 'Best for validating one high-impact workflow.',
        features: [
          '1 workflow automation map',
          '1 custom AI agent setup',
          '1 team enablement session'
        ],
        ctaLabel: 'Start with Starter',
        ctaLink: '/book'
      },
      {
        name: 'Growth',
        price: '$4,000',
        description: 'For teams scaling automation across operations.',
        features: [
          'Up to 3 workflow automations',
          'Agent orchestration blueprint',
          'Implementation support + QA'
        ],
        ctaLabel: 'Book Growth Plan',
        ctaLink: '/book',
        highlighted: true
      },
      {
        name: 'Scale',
        price: 'Custom',
        description: 'Enterprise-grade workflows and governance.',
        features: [
          'Multi-team automation architecture',
          'Security and compliance alignment',
          'Dedicated technical advisory'
        ],
        ctaLabel: 'Talk to Sales',
        ctaLink: '/book'
      }
    ];
  }

  getStarterKitPoints(): string[] {
    return [
      'Angular-ready starter project structure',
      'Reusable prompts and agent workflow templates',
      'Deployment checklist and scaling notes'
    ];
  }

  getTestimonials(): Array<{ name: string; role: string; quote: string }> {
    return [
      {
        name: 'Client Name',
        role: 'Operations Lead',
        quote: 'Placeholder testimonial: add a real customer success quote here.'
      },
      {
        name: 'Client Name',
        role: 'Founder',
        quote: 'Placeholder testimonial: describe measurable impact from automation.'
      }
    ];
  }
}
