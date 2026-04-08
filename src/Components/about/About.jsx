import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const features = [
  { num: "01", title: "Curated Photography",   desc: "Access to millions of high-quality images from talented photographers worldwide through the Unsplash API." },
  { num: "02", title: "AI Image Generation",   desc: "Create stunning, unique images using cutting-edge Flux AI technology from Nebius." },
  { num: "03", title: "Global Community",      desc: "Join a worldwide community of creators, artists, and visual storytellers." },
  { num: "04", title: "Innovative Technology", desc: "Built with React, Redux, and the latest AI APIs for optimal performance and user experience." },
];

const stats = [
  { number: "10M+",  label: "Images Served" },
  { number: "500K+", label: "Happy Users"   },
  { number: "50+",   label: "Countries"     },
  { number: "99.9%", label: "Uptime"        },
];

const team = [
  { name: "Sarah Johnson",   role: "Lead Designer",       image: "https://images.unsplash.com/photo-1494790108755-2616b612c5d3?w=400&h=400&fit=crop&crop=face" },
  { name: "Michael Chen",    role: "Full Stack Developer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
  { name: "Emily Rodriguez", role: "AI Specialist",        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" },
];

const values = [
  { title: "Creativity First",  desc: "We believe creativity is the heart of human expression. Every feature is designed to empower and inspire creative minds." },
  { title: "Community Driven",  desc: "Our platform thrives because of our amazing community. We listen, learn, and evolve based on user feedback and needs." },
  { title: "Innovation",        desc: "We embrace cutting-edge technology and innovative solutions to create experiences that push boundaries." },
  { title: "Accessibility",     desc: "Beautiful visual content should be accessible to everyone, regardless of location, background, or technical expertise." },
];

function TeamCard({ member }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ border: `1px solid ${hovered ? "var(--gold)" : "var(--border)"}`, background: "var(--surface-2)", padding: "24px", transition: "border-color 0.2s", textAlign: "center" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: "80px", height: "80px", margin: "0 auto 16px", overflow: "hidden", border: "1px solid var(--border)" }}>
        <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(30%)" }} />
      </div>
      <h3 className="serif-display" style={{ fontSize: "20px", marginBottom: "4px" }}>{member.name}</h3>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "16px" }}>{member.role}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        {[<FaGithub size={11} key="gh" />, <FaLinkedin size={11} key="li" />, <FaTwitter size={11} key="tw" />].map((icon, i) => (
          <a
            key={i}
            href="#"
            style={{ width: "26px", height: "26px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s, border-color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            {icon}
          </a>
        ))}
      </div>
    </div>
  );
}

const About = () => (
  <div style={{ background: "var(--bg)" }}>

    {/* Hero */}
    <section className="px-section" style={{ paddingTop: "72px", paddingBottom: "64px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "24px" }}>About — Visual Gallery</div>
        <h1 className="serif-display" style={{ fontSize: "clamp(48px, 7vw, 80px)", lineHeight: 0.9, marginBottom: "24px" }}>
          Empowering<br /><em style={{ color: "var(--gold)" }}>Creative</em><br />Minds
        </h1>
        <div className="gold-rule" style={{ marginBottom: "20px" }} />
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.5px", lineHeight: 1.9, maxWidth: "560px" }}>
          We're passionate about making visual content accessible, beautiful, and inspiring for everyone. Combining the best of human creativity with cutting-edge AI technology.
        </p>
      </div>
    </section>

    {/* Features */}
    <section className="px-section" style={{ paddingTop: "48px", paddingBottom: "48px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "32px" }}>What We Offer</div>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: "32px", alignItems: "flex-start", padding: "28px 0", borderTop: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "40px", color: "var(--gold)", opacity: 0.4, lineHeight: 1, minWidth: "60px" }}>{f.num}</div>
            <div>
              <h3 className="serif-display" style={{ fontSize: "24px", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.5px", lineHeight: 1.8, maxWidth: "480px" }}>{f.desc}</p>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>
    </section>

    {/* Stats */}
    <section className="px-section" style={{ paddingTop: "64px", paddingBottom: "64px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "40px" }}>Our Impact</div>
        <div className="grid-stats">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="serif-display" style={{ fontSize: "56px", lineHeight: 1, color: "var(--gold)", marginBottom: "8px" }}>{s.number}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="px-section" style={{ paddingTop: "48px", paddingBottom: "48px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "32px" }}>The Team</div>
        <div className="grid-team">
          {team.map((member, i) => <TeamCard key={i} member={member} />)}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="px-section" style={{ paddingTop: "48px", paddingBottom: "48px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "32px" }}>Our Values</div>
        <div className="grid-values">
          {values.map((v, i) => (
            <div key={i} className="values-item">
              <div style={{ borderLeft: "2px solid var(--gold)", paddingLeft: "16px" }}>
                <h3 className="serif-display" style={{ fontSize: "22px", marginBottom: "8px" }}>{v.title}</h3>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.5px", lineHeight: 1.9 }}>{v.desc}</p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)", gridColumn: "span 2" }} />
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="px-section" style={{ paddingTop: "72px", paddingBottom: "72px", background: "var(--surface)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 className="serif-display" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontStyle: "italic", marginBottom: "16px" }}>
          Ready to Join Our <span style={{ color: "var(--gold)" }}>Journey?</span>
        </h2>
        <div className="gold-rule" style={{ marginBottom: "24px", maxWidth: "280px" }} />
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link to="/gallery"><button className="btn-gold">Explore Gallery</button></Link>
          <Link to="/image"><button className="btn-outline">Try AI Generation</button></Link>
        </div>
      </div>
    </section>
  </div>
);

export default About;
