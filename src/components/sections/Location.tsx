import Reveal from '@/components/Reveal';
import TourButton from '@/components/enquiry/TourButton';

export default function Location() {
  return (
    <section id="enquire" className="bg-bone py-24 md:py-36">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="eyebrow">Visit · Box Hill</p>
          <h2 className="h-display mt-6">
            Come and see
            <br />
            <span className="italic">the space.</span>
          </h2>
          <p className="lead mt-7 max-w-lg">
            The best way to understand Hexa Space is to stand in it. Send an
            enquiry and we’ll arrange a private tour of the floor, the lounge
            and the studios.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <TourButton className="btn">
              Book a private tour
            </TourButton>
            <a href="tel:+61406016666" className="btn">
              +61 406 016 666
            </a>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="grid gap-8 sm:grid-cols-2 lg:pl-10">
            <div className="border-t border-ink pt-4">
              <p className="eyebrow">Address</p>
              <p className="prose-body text-ink mt-3">
                Level 4, 830 Whitehorse Road,
                <br />
                Box Hill VIC 3128
              </p>
            </div>
            <div className="border-t border-ink pt-4">
              <p className="eyebrow">Contact</p>
              <p className="prose-body text-ink mt-3">
                <a href="tel:+61406016666" className="hover:text-hexa-green transition-colors">
                  +61 406 016 666
                </a>
                <br />
                <a
                  href="mailto:info@hexaspace.com.au"
                  className="hover:text-hexa-green transition-colors"
                >
                  info@hexaspace.com.au
                </a>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
