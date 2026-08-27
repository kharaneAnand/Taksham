import {
  ArrowRight,
  Check,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import livingRoom from "../../assets/images/rooms/living-room.png";
import heroimg from "../../assets/images/looks/Hero_product_page.png";

import prathameshImage from "../../assets/images/hero/parthmesh.jpeg";
import aparnaImage from "../../assets/images/hero/dirctor.jpeg";
import sushantImage from "../../assets/images/hero/adv.jpeg";

const About = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Prathamesh Deshpande",
      role: "Founder & Managing Director",
      image: prathameshImage,
      description: [
        "As a founding member, Prathamesh Deshpande brings vision, operational focus, and a deep dedication to design excellence to the brand.",
        "He oversees strategic direction, quality assurance, and client experience while ensuring every solution reflects reliability, thoughtful design, and long-term value.",
      ],
    },
    {
      name: "Aparna Kulkarni",
      role: "Co-Founder & Design Director",
      image: aparnaImage,
      description: [
        "With 15+ years of experience in interior design, Aparna Kulkarni brings deep expertise in design, functionality, materials, and space planning.",
        "She combines her experience in interiors with Taksham's vision for modern, functional, and thoughtfully designed furniture.",
      ],
    },
    {
      name: "Adv. Sushant Pande",
      role: "Legal Department",
      image: sushantImage,
      description: [
        "Adv. Sushant Pande oversees legal and compliance matters, helping Taksham operate with transparency, accountability, and sound business practices.",
        "His guidance supports contractual matters, legal documentation, regulatory compliance, and strong relationships with clients and partners.",
      ],
    },
  ];

  const values = [
    {
      title: "Thoughtful Design",
      text: "Furniture with character, comfort and purpose—designed to feel naturally at home in your space.",
    },
    {
      title: "Quality First",
      text: "Careful attention to materials, finishes and details that create a better experience over time.",
    },
    {
      title: "Customer First",
      text: "From discovering a piece to welcoming it home, we aim to make every step feel simple and personal.",
    },
  ];

  return (
    <main className="overflow-hidden bg-[#FAF8F5] text-[#302B25]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mx-auto max-w-[1600px] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-10 lg:pt-8 xl:px-14">
        <div className="relative min-h-155 overflow-hidden rounded-[28px] border border-[#DED3C5] bg-[#EDE4D8] shadow-[0_20px_70px_rgba(65,48,30,0.08)] sm:min-h-170 lg:min-h-180 xl:min-h-190">
          {/* Background image */}

          <img
            src={heroimg}
            alt="Taksham living space"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Main overlay */}

          <div className="absolute inset-0 bg-linear-to-r from-[#F4EEE5] via-[#F4EEE5]/92 via-35% to-[#30251B]/10" />

          <div className="absolute inset-0 bg-linear-to-t from-[#211A14]/45 via-transparent to-transparent" />

          {/* Decorative glow */}

          <div className="absolute -left-24 top-0 h-125 w-125 rounded-full bg-[#E7C89B]/20 blur-3xl" />

          {/* Content */}

          <div className="relative z-10 flex min-h-155 flex-col justify-between p-6 sm:min-h-170 sm:p-10 lg:min-h-180 lg:p-14 xl:min-h-190 xl:p-18">
            {/* Top */}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9C5AA] bg-[#FFFDF9]/75 backdrop-blur-sm">
                  <Sparkles
                    size={14}
                    strokeWidth={1.5}
                    className="text-[#A4773E]"
                  />
                </span>

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#9A7138]">
                    Taksham Living
                  </p>

                  <p className="mt-1 text-[9px] text-[#756A5E]">
                    Furniture · Interiors · Living
                  </p>
                </div>
              </div>

              <span className="hidden rounded-full border border-[#D8C7B2] bg-[#FFFDF9]/65 px-4 py-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#8D6940] backdrop-blur-md sm:block">
                About us
              </span>
            </div>

            {/* Main hero text */}

            <div className="max-w-190">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#A4773E]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#9A7138] sm:text-[9px]">
                  Designed around real living
                </p>
              </div>

              <h1 className="mt-6 max-w-190 font-serif text-[50px] font-medium leading-[0.92] tracking-[-0.055em] text-[#29241F] sm:text-[68px] lg:text-[82px] xl:text-[96px]">
                Furniture that
                <br />

                <span className="text-[#9A7138]">
                  feels like home.
                </span>
              </h1>

              <p className="mt-6 max-w-130 text-[12px] leading-7 text-[#70665B] sm:text-[13px]">
                Taksham brings together thoughtfully
                designed furniture and beautiful spaces
                to help you create a home that feels
                personal, comfortable and truly yours.
              </p>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#302B25] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(48,43,37,0.16)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#443C34]"
              >
                Explore our collection

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                  <ArrowRight
                    size={13}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </button>
            </div>

            {/* Bottom details */}

            <div className="flex flex-col gap-5 border-t border-[#BFAF9B]/50 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="font-serif text-[14px] text-[#A4773E]">
                  01
                </span>

                <span className="h-7 w-px bg-[#CBBBA8]" />

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#5E5347]">
                    The Taksham philosophy
                  </p>

                  <p className="mt-1 text-[10px] text-[#81776C]">
                    Thoughtful spaces for everyday life
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full border border-white/60 bg-[#F7F0E7]/80 px-4 py-2 backdrop-blur-md sm:self-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

                <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#67594A]">
                  Made for modern living
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR STORY
      ===================================================== */}

      <section className="mx-auto max-w-365 px-5 py-16 sm:px-8 sm:py-22 lg:px-12 lg:py-28 xl:px-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
          {/* Image */}

          <div className="group relative">
            <div className="absolute -bottom-5 -right-5 hidden h-full w-full rounded-[28px] border border-[#DCC9B2] lg:block" />

            <div className="relative aspect-[4/4.4] overflow-hidden rounded-[28px] border border-[#E1D8CD] bg-[#EEE8DF] shadow-[0_18px_50px_rgba(60,45,30,0.07)]">
              <img
                src={livingRoom}
                alt="A Taksham living space"
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#211A14]/45 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 rounded-2xl border border-white/25 bg-[#30251B]/45 px-4 py-3 backdrop-blur-md">
                <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-[#E8D0AA]">
                  The Taksham edit
                </p>

                <p className="mt-1 font-serif text-[16px] text-white">
                  Spaces made to be lived in.
                </p>
              </div>
            </div>
          </div>

          {/* Text */}

          <div className="max-w-155">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#A4773E]" />

              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#A4773E]">
                Our story
              </p>
            </div>

            <h2 className="mt-5 font-serif text-[40px] leading-[0.98] tracking-tighter text-[#302B25] sm:text-[50px] lg:text-[58px]">
              Good furniture
              <br />
              changes how a
              <br />

              <span className="text-[#9A7138]">
                space feels.
              </span>
            </h2>

            <div className="mt-6 h-px w-12 bg-[#B7894A]" />

            <div className="mt-6 space-y-5 text-[12px] leading-7 text-[#81776C] sm:text-[13px]">
              <p>
                We believe furniture should be more than
                something you simply place in a room. It
                should complement the way you live,
                gather, relax and create memories.
              </p>

              <p>
                That's why Taksham focuses on thoughtful
                design, comfortable forms and pieces that
                naturally become part of your everyday
                life.
              </p>

              <p>
                Whether you're furnishing one corner or
                creating an entire home, we're here to
                make the process feel simpler, more
                personal and more enjoyable.
              </p>
            </div>

            <div className="mt-9 grid grid-cols-3 border-y border-[#E4DBD1] py-5">
              <div>
                <p className="font-serif text-[26px] text-[#302B25]">
                  01
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-[#9A7138]">
                  Design first
                </p>
              </div>

              <div className="border-x border-[#E4DBD1] px-5">
                <p className="font-serif text-[26px] text-[#302B25]">
                  02
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-[#9A7138]">
                  Built to last
                </p>
              </div>

              <div className="pl-5">
                <p className="font-serif text-[26px] text-[#302B25]">
                  03
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-[#9A7138]">
                  Made for you
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="group mt-8 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#76562F]"
            >
              Explore the collection

              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          LEADERSHIP
      ===================================================== */}

      <section className="border-y border-[#E5DDD4] bg-[#F4EEE6]">
        <div className="mx-auto max-w-363 px-5 py-16 sm:px-8 sm:py-22 lg:px-12 lg:py-28 xl:px-16">
          <div className="mx-auto max-w-180 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#A4773E]" />

              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#A4773E]">
                The people behind Taksham
              </p>

              <span className="h-px w-8 bg-[#A4773E]" />
            </div>

            <h2 className="mt-5 font-serif text-[40px] leading-none tracking-widest text-[#302B25] sm:text-[52px]">
              Meet the people
              <br />

              <span className="text-[#9A7138]">
                shaping Taksham.
              </span>
            </h2>

            <p className="mt-5 text-[12px] leading-6 text-[#81776C]">
              A shared vision for thoughtful design,
              reliable craftsmanship and spaces that
              feel better to live in.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <article
                key={member.name}
                className="group overflow-hidden rounded-[26px] border border-[#DED3C5] bg-[#FBF9F6] shadow-[0_12px_35px_rgba(60,45,30,0.045)] transition-all duration-500 hover:-translate-y-2 hover:border-[#CDB28B] hover:shadow-[0_24px_60px_rgba(55,43,31,0.10)]"
              >
                {/* Fixed photo box */}

                <div className="relative aspect-[4/4.6] overflow-hidden bg-[#E8DED2]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-[#211A14]/60 via-transparent to-transparent" />

                  <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/15 font-serif text-[12px] text-white backdrop-blur-md">
                    0{index + 1}
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#E6C38C]">
                      {member.role}
                    </p>

                    <h3 className="mt-2 font-serif text-[30px] leading-[1.05] tracking-[-0.04em] text-white">
                      {member.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="h-px w-10 bg-[#B7894A]" />

                  <div className="mt-5 space-y-4 text-[11px] leading-6 text-[#81776C] sm:text-[12px]">
                    {member.description.map(
                      (paragraph, paragraphIndex) => (
                        <p key={paragraphIndex}>
                          {paragraph}
                        </p>
                      ),
                    )}
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#A4773E]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />
                    Taksham leadership
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="mx-auto max-w-363 px-5 py-16 sm:px-8 sm:py-22 lg:px-12 lg:py-26 xl:px-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#A4773E]" />

              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#A4773E]">
                What matters to us
              </p>
            </div>

            <h2 className="mt-5 font-serif text-[38px] leading-none tracking-tighter text-[#302B25] sm:text-[48px]">
              Simple things.
              <br />

              <span className="text-[#9A7138]">
                Done thoughtfully.
              </span>
            </h2>
          </div>

          <p className="max-w-90 text-[11px] leading-6 text-[#81776C] sm:text-right">
            The principles that guide the way we design,
            work and build experiences for our customers.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {values.map((item, index) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-[22px] border border-[#E0D6CA] bg-[#FBF9F6] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#CDB28B] hover:shadow-[0_18px_45px_rgba(55,43,31,0.07)]"
            >
              <span className="absolute right-7 top-7 font-serif text-[14px] text-[#C6A777]">
                0{index + 1}
              </span>

              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DCCBB5] bg-[#F2E7D8]">
                <Check
                  size={17}
                  strokeWidth={1.7}
                  className="text-[#8F6B3F]"
                />
              </span>

              <h3 className="mt-8 font-serif text-[27px] tracking-[-0.03em] text-[#302B25]">
                {item.title}
              </h3>

              <p className="mt-3 max-w-sm text-[11px] leading-6 text-[#81776C] sm:text-[12px]">
                {item.text}
              </p>

              <div className="mt-7 h-px w-8 bg-[#B7894A] transition-all duration-300 group-hover:w-16" />
            </article>
          ))}
        </div>
      </section>

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section className="border-y border-[#E5DDD4] bg-[#F7F2EB]">
        <div className="mx-auto max-w-295 px-5 py-16 sm:px-8 sm:py-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#A4773E]" />

              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#A4773E]">
                Contact Taksham
              </p>

              <span className="h-px w-8 bg-[#A4773E]" />
            </div>

            <h2 className="mt-5 font-serif text-[38px] leading-none tracking-tighter text-[#302B25] sm:text-[50px]">
              Let's talk about
              <br />

              <span className="text-[#9A7138]">
                your space.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-145 text-[11px] leading-6 text-[#81776C] sm:text-[12px]">
              Need help choosing furniture, have a
              question about your order, or simply want
              to know more about Taksham? We'd love to
              hear from you.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <a
              href="mailto:hello@taksham.com"
              className="group rounded-[22px] border border-[#E1D8CD] bg-[#FCFAF7] p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-[#CDB28B] hover:shadow-[0_18px_40px_rgba(55,43,31,0.07)]"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#DCCBB5] bg-[#F2E7D8]">
                <Mail
                  size={18}
                  strokeWidth={1.4}
                  className="text-[#8F6B3F]"
                />
              </span>

              <p className="mt-5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#A4773E]">
                Email us
              </p>

              <p className="mt-2 text-[12px] font-medium text-[#403A33]">
                hello@taksham.com
              </p>
            </a>

            <a
              href="tel:+919999999999"
              className="group rounded-[22px] border border-[#E1D8CD] bg-[#FCFAF7] p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-[#CDB28B] hover:shadow-[0_18px_40px_rgba(55,43,31,0.07)]"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#DCCBB5] bg-[#F2E7D8]">
                <Phone
                  size={18}
                  strokeWidth={1.4}
                  className="text-[#8F6B3F]"
                />
              </span>

              <p className="mt-5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#A4773E]">
                Call us
              </p>

              <p className="mt-2 text-[12px] font-medium text-[#403A33]">
                +91 8080636955
              </p>
            </a>

            <a
              href="https://wa.me/8080636955"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[22px] border border-[#E1D8CD] bg-[#FCFAF7] p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-[#CDB28B] hover:shadow-[0_18px_40px_rgba(55,43,31,0.07)]"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#DCCBB5] bg-[#F2E7D8]">
                <MessageCircle
                  size={18}
                  strokeWidth={1.4}
                  className="text-[#8F6B3F]"
                />
              </span>

              <p className="mt-5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#A4773E]">
                WhatsApp
              </p>

              <p className="mt-2 text-[12px] font-medium text-[#403A33]">
                Chat with us
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="bg-[#302B25]">
        <div className="relative mx-auto max-w-275 overflow-hidden px-5 py-16 text-center sm:px-8 sm:py-20">
          <div className="absolute left-1/2 top-1/2 h-105 w-105 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A4773E]/10 blur-3xl" />

          <div className="relative">
            <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#D1AC70]">
              Taksham
            </p>

            <h2 className="mt-5 font-serif text-[40px] leading-[0.95] tracking-tighter text-[#F7F2EB] sm:text-[54px]">
              Find something
              <br />

              <span className="text-[#C9A16A]">
                you'll love.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-120 text-[11px] leading-6 text-white/50 sm:text-[12px]">
              Discover furniture and ideas created to
              make everyday spaces feel more personal.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#C29A5E] px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.17em] text-white shadow-[0_14px_35px_rgba(194,154,94,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#AF854D]"
            >
              Shop collection

              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;