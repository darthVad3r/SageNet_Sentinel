import { TestBed } from '@angular/core/testing';
import { LandingContentService } from './landing-content.service';

describe('LandingContentService', () => {
  let service: LandingContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandingContentService);
  });

  it('should provide pricing plans', () => {
    const plans = service.getPricingPlans();
    expect(plans.length).toBeGreaterThan(0);
    expect(plans.some((p) => p.highlighted)).toBe(true);
  });

  it('should provide booking and checkout links', () => {
    expect(service.bookingUrl.length).toBeGreaterThan(0);
    expect(service.kitCheckoutUrl.length).toBeGreaterThan(0);
  });
});
