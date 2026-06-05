import { memo, useEffect, useRef, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

import quickbooksImg from "../assets/images/Quickbooks.png";
import xeroImg from "../assets/images/Xero_software_logo.svg.png";
import empireImg from "../assets/images/Empire.png";
import quantumImg from "../assets/images/Quantum.png";
import ecjImg from "../assets/images/ECJ Online.png";
import ecovisImg from "../assets/images/ECOVIS.png";
import deepakImg from "../assets/images/LinkdeIn Image (1).png";
import dineshImg from "../assets/images/Dinesh.jpg";
import ujjwalImg from "../assets/images/Ujjwal.jpg";
import anilImg from "../assets/images/Anil (1).png";
import earthVideo from "../assets/video/Earth Animation.mp4";

gsap.registerPlugin(ScrollTrigger);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const ArrowIcon = () => (
  <span className="arrow-icon">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      width="14"
    >
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  </span>
);

const Homepage = () => {
  const hasInit = useRef(false);

  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;

    // Lenis smooth scroll
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Counter animation
    const countUp = (el: HTMLElement | null, target: number, dur = 2000) => {
      if (!el) return;
      let start = 0;
      const step = (target / dur) * 16;
      const run = () => {
        start = Math.min(start + step, target);
        el.innerHTML = Math.floor(start) + "<em>+</em>";
        if (start < target) requestAnimationFrame(run);
      };
      run();
    };
    setTimeout(() => {
      countUp(document.getElementById("c1"), 500);
      countUp(document.getElementById("c2"), 30, 1500);
      countUp(document.getElementById("c3"), 8, 1000);
    }, 1200);

    // Scroll reveal
    gsap.utils
      .toArray<Element>(".reveal, .reveal-left, .reveal-right")
      .forEach((el) => {
        const fromLeft = el.classList.contains("reveal-left");
        const fromRight = el.classList.contains("reveal-right");
        gsap.fromTo(
          el,
          {
            autoAlpha: 0,
            y: !fromLeft && !fromRight ? 52 : 18,
            x: fromLeft ? -52 : fromRight ? 52 : 0,
          },
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            duration: 1.05,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

    // Journey progress line
    const journeySection = document.querySelector("#journey");
    const journeyProgress = document.querySelector("#journey-line-progress");
    if (journeySection && journeyProgress) {
      gsap.fromTo(
        journeyProgress,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: journeySection,
            start: "top 72%",
            end: "bottom 28%",
            scrub: 1,
          },
        },
      );
    }

    // Nav scroll
    const onScroll = (y: number) => {
      const nav = document.getElementById("navbar");
      if (nav) nav.classList.toggle("scrolled", y > 80);
    };
    lenis.on("scroll", ({ scroll }: { scroll: number }) => onScroll(scroll));

    // Cursor
    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursor-ring");
    let mx = 0,
      my = 0,
      cx = 0,
      cy = 0,
      rx = 0,
      ry = 0;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });
    const animateCursor = () => {
      cx += (mx - cx) * 0.9;
      cy += (my - cy) * 0.9;
      if (cursor) {
        cursor.style.left = cx + "px";
        cursor.style.top = cy + "px";
      }
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      if (ring) {
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
      }
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document
      .querySelectorAll<Element>(
        "a,button,.svc-card,.blog-featured,.blog-card-sm",
      )
      .forEach((el) => {
        el.addEventListener("mouseenter", () => {
          if (cursor) {
            cursor.style.width = "20px";
            cursor.style.height = "20px";
          }
          if (ring) {
            ring.style.width = "60px";
            ring.style.height = "60px";
            ring.style.borderColor = "rgba(204,17,17,.8)";
          }
        });
        el.addEventListener("mouseleave", () => {
          if (cursor) {
            cursor.style.width = "10px";
            cursor.style.height = "10px";
          }
          if (ring) {
            ring.style.width = "38px";
            ring.style.height = "38px";
            ring.style.borderColor = "rgba(122,122,122,.55)";
          }
        });
      });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      // 1. Prevent the browser from reloading the page
      e.preventDefault();

      const form = e.currentTarget;

      // 2. Handle Button UI (Change to "Sending...")
      const btnText = form.querySelector(".btn-submit span") as HTMLElement;
      const originalText = btnText ? btnText.innerText : "Send Message";
      if (btnText) {
        btnText.innerText = "Sending...";
      }

      // 3. Grab all the data from the form inputs
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        // 4. Send the POST request to your backend
        // Make sure to replace 'your-endpoint' with your actual backend route (e.g., '/contact')
        const response = await fetch("http://localhost:3000/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}` // Uncomment if this route is protected
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log("Success:", result);

        // Optional: Clear the form after a successful submission
        form.reset();

      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        // 5. Revert the button text back to original, regardless of success or failure
        if (btnText) {
          btnText.innerText = originalText;
        }
      }
    };

    return (
      <>
        {/* CURSOR */}
        <div id="cursor" />
        <div id="cursor-ring" />

        {/* HERO */}
        <section id="hero">
          <div className="hero-bg" />
          <div className="hero-grid-lines" />
          <video
            id="hero-video"
            src={earthVideo}
            autoPlay
            loop
            muted
            playsInline
          />

          <div className="hero-counter">
            <div className="stat">
              <div className="stat-n" id="c1">
                0<em>+</em>
              </div>
              <div className="stat-l">Accountants Trained</div>
            </div>
            <div className="stat">
              <div className="stat-n" id="c2">
                0<em>+</em>
              </div>
              <div className="stat-l">Global Placements</div>
            </div>
            <div className="stat">
              <div className="stat-n" id="c3">
                0<em>+</em>
              </div>
              <div className="stat-l">Software Courses</div>
            </div>
          </div>

          <div className="hero-eyebrow">
            Accounting Training · Kathmandu, Nepal
          </div>
          <h1 className="hero-title">
            Nepal's
            <br />
            <span className="outline">Gateway</span>
            <br />
            to <span className="red">Global</span>
          </h1>

          <div className="hero-sub-row">
            <p className="hero-sub">
              Empowering young accounting professionals with world-class software
              training and direct pathways to international career opportunities.
            </p>
            <div className="hero-cta-group">
              <a
                href="#services"
                className="btn-main"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("services");
                }}
              >
                Explore Courses <ArrowIcon />
              </a>
              <a
                href="#about"
                className="btn-ghost"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("about");
                }}
              >
                Our Story <ArrowIcon />
              </a>
            </div>
          </div>

          <div className="scroll-indicator">
            <div className="scroll-line" />
            Scroll to explore
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee-section">
          <div className="marquee-track">
            {[0, 1].map((i) => (
              <div className="marquee-item" key={i}>
                QuickBooks <em>·</em> Xero <em>·</em> MYOB <em>·</em> SAGE{" "}
                <em>·</em>
                Leadership Skills <em>·</em> Communication <em>·</em> Global
                Careers <em>·</em> Accounting Law <em>·</em>
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <section id="about">
          <div className="s-label reveal">About Us</div>
          <div className="about-layout">
            <div className="about-content reveal-left">
              <h2 className="s-title">
                The Bridge Between
                <br />
                Talent &amp; Opportunity
              </h2>
              <p className="about-eyeline">
                Nepal's best accounting professionals shouldn't have to leave the
                country to build world-class careers — and the world's top firms
                shouldn't have to look far to find exceptional talent.
              </p>
              <p className="about-bridge">We are the bridge.</p>
              <p className="about-desc">
                Aros Octa Consulting is a dual-purpose firm built on a singular
                mission: to connect talent with opportunity, and businesses with
                solutions. We don't just train professionals — we architect
                careers. We don't just fill vacancies — we build lasting
                partnerships between Nepal's finest minds and the international
                firms that need them.
              </p>
            </div>
            <div className="reveal-right">
              <div className="about-dual">
                <div className="dual-card">
                  <div className="dc-kicker">Side One</div>
                  <h4>Business Solutions</h4>
                  <p>
                    Full-service Financial, HR, and Technology services for SMEs
                    across Nepal and beyond.
                  </p>
                </div>
                <div className="dual-card">
                  <div className="dc-kicker">Side Two</div>
                  <h4>Global Talent Bridge</h4>
                  <p>
                    Identifying, training, and placing high-calibre Nepali
                    accounting professionals with Australian and international
                    firms.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="partner-marquee-section reveal">
            <div className="partner-marquee-title">Where Our People Work</div>
            <div className="partner-marquee-wrap">
              <div className="partner-marquee-track">
                {[
                  empireImg,
                  quantumImg,
                  ecjImg,
                  ecovisImg,
                  empireImg,
                  quantumImg,
                  ecjImg,
                  ecovisImg,
                ].map((src, i) => (
                  <div
                    className={`partner-logo-box${i === 2 || i === 3 || i === 6 || i === 7 ? " light-bg" : ""}`}
                    key={i}
                  >
                    <img src={src} alt="partner" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services">
          <div className="services-intro">
            <div>
              <div className="s-label reveal">Services &amp; Courses</div>
              <h2 className="s-title reveal">
                What We
                <br />
                Offer
              </h2>
            </div>
            <p className="reveal">
              From beginner to advanced — every course is built to make you
              competitive in the global accounting market.
            </p>
          </div>
          <div className="services-grid">
            {[
              {
                num: "01",
                img: quickbooksImg,
                title: "QuickBooks Training",
                desc: "Master QuickBooks Online and Desktop with practical, job-ready exercises tailored for Nepali accounting professionals.",
                pill: "Beginner → Advanced",
              },
              {
                num: "02",
                img: xeroImg,
                title: "Xero Certification Prep",
                desc: "Guided instruction, real case studies, and exam-focused practice to achieve your Xero Advisor Certification.",
                pill: "Certification",
              },
              {
                num: "03",
                svg: (
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                ),
                title: "Global Opportunity Program",
                desc: "CV building, interview prep, and direct introductions to international accounting firms recruiting from Nepal.",
                pill: "Career Development",
              },
              {
                num: "04",
                svg: (
                  <svg viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                ),
                title: "MYOB & SAGE Training",
                desc: "Popular in Australian, UK, and Middle Eastern markets — master these platforms and open more global doors.",
                pill: "Software Mastery",
              },
              {
                num: "05",
                svg: (
                  <svg viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: "1-on-1 Mentorship",
                desc: "Personalized sessions with expert mentors to tackle your specific career challenges and accelerate your growth.",
                pill: "Personalized",
              },
              {
                num: "06",
                svg: (
                  <svg viewBox="0 0 24 24">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
                title: "Excel for Accountants",
                desc: "Advanced Excel, pivot tables, and financial modelling skills — the power tools every global accountant must have.",
                pill: "Power Skills",
              },
            ].map((s, i) => (
              <div
                className={`svc-card reveal stagger-${(i % 3) + 1}`}
                key={s.num}
              >
                <div className="svc-num">{s.num}</div>
                <div className="svc-icon">
                  {s.img ? <img src={s.img} alt={s.title} /> : s.svg}
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="svc-pill">{s.pill}</span>
                <span className="svc-learn">Learn More</span>
                <div className="svc-arrow">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* JOURNEY */}
        <section id="journey">
          <div className="journey-intro">
            <div className="s-label reveal">Program Journey</div>
            <h2 className="s-title reveal">
              A Clear Path from
              <br />
              Training to Certification
            </h2>
            <p className="reveal">
              A focused 10-day learning experience designed to build practical
              confidence in QuickBooks Online and Xero, ending with a final
              practical assessment for certification success.
            </p>
          </div>
          <div className="journey-timeline">
            <div className="journey-line" />
            <div className="journey-line-progress" id="journey-line-progress" />
            {[
              {
                img: quickbooksImg,
                kicker: "Days 1-5",
                title: "Quickbooks Online",
                desc: "Participants set up and manage QuickBooks Online environments, covering chart of accounts, inventory, invoicing, purchases, reconciliation, and financial reporting workflows.",
              },
              {
                img: xeroImg,
                kicker: "Days 6-9",
                title: "XERO Training",
                desc: "Learners progress into Xero with hands-on sessions in setup, invoicing, credit notes, bills, payroll-linked flows, cash coding, reconciliation, and GST/tax-ready reporting.",
              },
              {
                svg: (
                  <svg viewBox="0 0 24 24">
                    <path d="M20 7L9 18l-5-5" />
                  </svg>
                ),
                kicker: "Step 3",
                title: "Final Certification Success",
                desc: "In the final practical assessment, trainees demonstrate end-to-end competency and graduate as job-ready accounting software professionals with real-world confidence.",
              },
            ].map((step, i) => (
              <article className="journey-step reveal" key={i}>
                <span className="journey-dot" />
                <div className="journey-step-head">
                  <div className="journey-icon">
                    {step.img ? (
                      <img src={step.img} alt={step.title} />
                    ) : (
                      step.svg
                    )}
                  </div>
                  <div className="journey-kicker">{step.kicker}</div>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials">
          <div className="s-label reveal">Testimonials</div>
          <h2 className="s-title reveal">What Our Graduates Say</h2>
          <div className="testimonials-grid">
            {[
              {
                quote:
                  '"The training was excellent. The trainer as well as the team were very supportive... I feel more confident in using cloud accounting software and I believe this knowledge will be useful for future accounting roles."',
                name: "Bibek Prasad Kushwaha",
              },
              {
                quote:
                  '"Each and everyone of you were dedicated and there for us to clear our doubts whenever needed. It was incredible to learn about QuickBooks & Xero software under your guidance."',
                name: "Pabitra Kumari Budhathoki",
              },
              {
                quote:
                  '"I must appreciate the supporting team from Aros Octa Consulting... the trainer is very calm and clarify every doubts come during the training. The practical, hands-on sessions were great."',
                name: "Nisha Shrestha",
              },
            ].map((t, i) => (
              <div className={`svc-card reveal stagger-${i + 1}`} key={t.name}>
                <p>{t.quote}</p>
                <h3>{t.name}</h3>
                <span className="testimonial-role">
                  QuickBooks &amp; Xero Graduate
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* MENTORS */}
        <section id="mentors">
          <div className="mentors-header">
            <div>
              <div className="s-label reveal">Meet Our Mentors</div>
              <h2 className="s-title reveal">
                Guided by the
                <br />
                Best in the Field
              </h2>
            </div>
            <p className="reveal">
              Our training program is delivered by certified professionals with
              real-world expertise in cloud accounting, audit, and financial
              operations.
            </p>
          </div>
          <div className="mentor-list">
            {[
              {
                img: deepakImg,
                name: "CA. Deepak Thapa",
                role: "Lead Instructor & Founder",
                bio: [
                  "CA (ICAN) & DipIFR (ACCA) qualified professional with strong expertise in Xero, QuickBooks Online, cloud bookkeeping, IFRS, and Australian taxation.",
                  "He has dedicated his career to bridging the gap between theoretical knowledge and practical application, successfully training over 200 aspiring accountants to secure competitive roles globally.",
                ],
                li: "https://linkedin.com/in/deepak-thapa-684887355",
                pos: "center 11%",
              },
              {
                img: dineshImg,
                name: "Dinesh Acharya",
                role: "Senior Accountant & Assistant Operations Manager",
                bio: [
                  "Dinesh is a highly skilled professional with over 2 years of extensive experience in the Australian tax and accounting sector.",
                  "His deep expertise covers bookkeeping, company and trust tax returns, payroll processing, and superannuation. He is passionate about mentoring the next generation of accountants.",
                ],
                li: "https://linkedin.com/in/dinesh-acharya-9680562b2",
                pos: "center 8%",
              },
              {
                img: ujjwalImg,
                name: "Ujjwal Chaudhary",
                role: "Certified Xero Advisor",
                bio: [
                  "Ujjwal is a seasoned accountant and mentor with more than 2 years of dedicated experience in Australian accounting workflows.",
                  "As a Certified Xero Advisor and Xero Payroll Practitioner, he brings invaluable hands-on expertise in comprehensive bookkeeping, payroll management, STP finalisation, and SMSF processing.",
                ],
                li: "https://linkedin.com/in/ujjwal-chaudhary-48470a254",
                pos: "center 10%",
              },
              {
                img: anilImg,
                name: "Anil Sunar",
                role: "Audit & Assurance Expert",
                bio: [
                  "Anil is a CA Final (ICAN) professional equipped with over 3 years of rigorous experience in audit and assurance across diverse industries.",
                  "His comprehensive portfolio spans manufacturing, hydropower, NGOs/INGOs, airlines, finance, and securities. His meticulous approach to compliance and NFRS provides deep insights for any aspiring corporate accountant.",
                ],
                li: "https://linkedin.com/in/anil-sunar-842626229",
                pos: "center 13%",
              },
            ].map((m) => (
              <div className="mentor-row reveal" key={m.name}>
                <div className="mentor-row-img">
                  <span className="mentor-pill">Mentor</span>
                  <img
                    src={m.img}
                    alt={m.name}
                    style={{ objectPosition: m.pos }}
                  />
                </div>
                <div className="mentor-row-content">
                  <div className="mentor-row-scroll">
                    <h3>{m.name}</h3>
                    <span className="mentor-role">{m.role}</span>
                    {m.bio.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                  <div className="mentor-socials">
                    <a
                      href={m.li}
                      className="mentor-social-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BLOG */}
        <section id="blog">
          <div className="s-label reveal">Blog &amp; Resources</div>
          <h2 className="s-title reveal">
            Knowledge for
            <br />
            Your Journey
          </h2>
          <div className="blog-layout">
            <div className="blog-featured reveal">
              <a href="#" className="blog-feat-arrow">
                <svg viewBox="0 0 24 24">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
              <div className="blog-feat-cat">Featured · 8 min read</div>
              <h2>
                How Nepali Accountants Can Land Remote Jobs in Australia and the
                UK in 2025
              </h2>
              <p>
                A step-by-step guide to getting Xero certified, building your
                remote-work profile, and applying to international firms from
                Kathmandu.
              </p>
              <div className="blog-meta">April 15, 2025 · Aros Octa Team</div>
            </div>
            <div className="blog-side">
              {[
                {
                  cat: "Software · 5 min",
                  title: "QuickBooks vs Xero: Which Should You Learn First?",
                  desc: "A practical comparison for Nepali accountants targeting global opportunities.",
                  date: "March 28, 2025",
                },
                {
                  cat: "Career · 6 min",
                  title:
                    "5 CV Mistakes Nepali Accountants Make When Applying Abroad",
                  desc: "Avoid these common errors and immediately stand out to international recruiters.",
                  date: "March 10, 2025",
                },
                {
                  cat: "Leadership · 4 min",
                  title:
                    "Why Communication Skills Are the Hidden Key to Global Accounting Careers",
                  desc: "Technical skills get you in the door — soft skills keep you in the room.",
                  date: "February 22, 2025",
                },
              ].map((b, i) => (
                <div
                  className={`blog-card-sm reveal stagger-${i + 1}`}
                  key={b.title}
                >
                  <div className="blog-cat">{b.cat}</div>
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                  <div className="date">{b.date}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="s-label reveal">Contact Us</div>
          <h2 className="s-title reveal">
            Let's Start
            <br />
            Your Journey
          </h2>
          <div className="contact-layout">
            <div className="contact-info reveal-left">
              <h3>We'd Love to Hear From You</h3>
              <p>
                Whether you're interested in a course, looking for mentorship, or
                want to partner with us — reach out and our team will respond
                within 24 hours.
              </p>
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                  label: "Location",
                  val: "Kathmandu, Nepal",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                  label: "Phone",
                  val: "+977 9806081893",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                  label: "Email",
                  val: "arosoctaconsulting@gmail.com",
                },
              ].map((d) => (
                <div className="c-detail" key={d.label}>
                  <div className="c-ico">{d.icon}</div>
                  <div className="c-text">
                    <div className="label">{d.label}</div>
                    <div className="val">{d.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <form className="contact-form reveal-right" onSubmit={handleSubmit}>
              <div className="f-row">
                <div className="f-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" placeholder="Rajesh" required />
                </div>
                <div className="f-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" placeholder="Sharma" required />
                </div>
              </div>

              <div className="f-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="f-group">
                <label>I'm Interested In</label>
                <select name="interest">
                  <option value="">Select a service...</option>
                  {[
                    "QuickBooks Training",
                    "Xero Certification Prep",
                    "Global Opportunity Program",
                    "MYOB & SAGE Training",
                    "1-on-1 Mentorship",
                    "Excel for Accountants",
                    "General Inquiry",
                  ].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="f-group">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Tell us about your current experience and what you hope to achieve..."
                />
              </div>

              <button type="submit" className="btn-submit">
                <span>Send Message</span>
                <span
                  className="arrow-icon"
                  style={{
                    width: 28,
                    height: 28,
                    borderColor: "rgba(255,255,255,.3)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    width="12"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </span>
              </button>
            </form>
          </div>
        </section>
      </>
    );
  };

export default memo(Homepage);
