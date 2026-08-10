import { motion } from "framer-motion";
import { MapPin, Github, Twitter, Mail, BookOpen, ArrowDown } from "lucide-react";
import { profile } from "@/data/profile";
import { useTypewriter } from "@/hooks/useTypewriter";
import SectionTitle from "@/components/shared/SectionTitle";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Timeline from "@/components/about/Timeline";
import GradientCover from "@/components/shared/GradientCover";

const socialIcons: Record<string, typeof Github> = {
  Github,
  Twitter,
  Mail,
  BookOpen,
};

const categoryLabels: Record<string, string> = {
  frontend: "前端",
  backend: "后端",
  design: "设计",
  tools: "工具",
};

const categoryColors: Record<string, string> = {
  frontend: "#0ea5e9",
  backend: "#f97316",
  design: "#7c3aed",
  tools: "#22c55e",
};

export default function About() {
  const typedRole = useTypewriter({
    texts: profile.roles,
    typeSpeed: 90,
    deleteSpeed: 45,
    delayBetween: 1800,
  });

  return (
    <div className="pt-24">
      <section className="border-b border-[var(--color-border)]">
        <div className="container py-12 sm:py-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_2fr]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-fit"
            >
              <div className="relative">
                <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-sky-200/40 via-purple-200/30 to-pink-200/30 blur-xl" />
                <GradientCover
                  cover={profile.avatar}
                  className="relative h-48 w-48 rounded-full"
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-display text-6xl font-black text-white/90">
                      凌
                    </span>
                  </div>
                </GradientCover>
                <div className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--color-surface)] bg-emerald-500">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
                <span className="h-px w-6 bg-[var(--color-primary)]" />
                个人信息
              </div>

              <h1 className="font-heading text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
                {profile.name}
              </h1>
              <div className="mt-2 font-mono text-sm text-[var(--color-primary)]">
                @{profile.alias}
              </div>

              <div className="mt-4 flex items-center gap-2 font-mono text-lg text-[var(--text-secondary)]">
                <span className="text-[var(--color-primary)]">&gt;</span>
                <span className="text-[var(--text-primary)]">{typedRole}</span>
                <span className="inline-block h-5 w-2 animate-pulse bg-[var(--color-primary)]" />
              </div>

              <p className="mt-6 max-w-2xl leading-relaxed text-[var(--text-secondary)]">
                {profile.bio}
              </p>

              <div className="mt-6 flex items-center gap-2 font-mono text-sm text-[var(--text-muted)]">
                <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
                {profile.location}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-py">
        <div className="container max-w-3xl">
          <SectionTitle
            eyebrow="成长经历"
            title="经历轨迹"
            description="从校园到赛场,从普通人到工程师。"
          />
          <Timeline items={profile.timeline} />
        </div>
      </section>

      <section className="section-py border-t border-[var(--color-border)]">
        <div className="container max-w-4xl">
          <SectionTitle
            eyebrow="技能图谱"
            title="能力图谱"
            description="技能熟练度可视化展示。"
            align="center"
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {Object.entries(categoryLabels).map(([catId, label], catIdx) => {
              const skills = profile.skills.filter(
                (s) => s.category === catId
              );
              if (skills.length === 0) return null;
              const color = categoryColors[catId];

              return (
                <ScrollReveal key={catId} delay={catIdx * 0.08}>
                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card">
                    <h3
                      className="mb-4 font-heading text-lg font-semibold"
                      style={{ color }}
                    >
                      {label}
                    </h3>
                    <div className="space-y-4">
                      {skills.map((skill, i) => (
                        <div key={skill.name}>
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="font-heading text-sm text-[var(--text-primary)]">
                              {skill.name}
                            </span>
                            <span
                              className="font-mono text-xs"
                              style={{ color }}
                            >
                              {skill.level}%
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: color }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.8,
                                delay: 0.15 + i * 0.08,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-py border-t border-[var(--color-border)]">
        <div className="container max-w-3xl">
          <SectionTitle
            eyebrow="联系方式"
            title="取得联系"
            description="无论合作、交流还是只是打个招呼,都欢迎。"
            align="center"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {profile.socials.map((social, i) => {
              const Icon = socialIcons[social.icon] ?? Mail;
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3 }}
                  className="group flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-card transition-all duration-250 hover:shadow-card-hover"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                    <Icon className="h-5 w-5 text-[var(--color-primary)] transition-colors group-hover:text-white" />
                  </div>
                  <div>
                    <div className="font-heading text-sm font-medium text-[var(--text-primary)]">
                      {social.name}
                    </div>
                    <div className="mt-0.5 font-mono text-xs text-[var(--text-faint)]">
                      {social.handle}
                    </div>
                  </div>
                  <ArrowDown className="ml-auto h-4 w-4 rotate-[-45deg] text-[var(--text-faint)] transition-colors group-hover:text-[var(--color-primary)]" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}