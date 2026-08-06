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
  frontend: "#00f0ff",
  backend: "#ff006e",
  design: "#7c3aed",
  tools: "#39ff14",
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
      {/* Hero 介绍 */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container relative z-10 py-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_2fr]">
            {/* 头像 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mx-auto w-fit"
            >
              <div className="relative">
                {/* 光环 */}
                <motion.div
                  className="absolute -inset-4 rounded-full opacity-50 blur-2xl"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #00f0ff, #ff006e, #7c3aed, #00f0ff)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <GradientCover
                  cover={profile.avatar}
                  className="relative h-48 w-48 rounded-full"
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-display text-6xl font-black text-white/80">
                      凌
                    </span>
                  </div>
                </GradientCover>
                {/* 状态点 */}
                <div className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-base-900 bg-neon-green">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
                </div>
              </div>
            </motion.div>

            {/* 介绍 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">
                <span className="h-px w-8 bg-neon-cyan shadow-[0_0_8px_var(--neon-cyan)]" />
                IDENTITY
              </div>

              <h1 className="font-display text-4xl font-black text-white sm:text-5xl">
                {profile.name}
              </h1>
              <div className="mt-2 font-mono text-sm text-neon-magenta">
                @{profile.alias}
              </div>

              {/* 打字机 */}
              <div className="mt-4 flex items-center gap-2 font-mono text-lg text-ink-muted">
                <span className="text-neon-cyan">&gt;</span>
                <span className="text-white">{typedRole}</span>
                <span className="inline-block h-5 w-2 animate-pulse bg-neon-cyan" />
              </div>

              <p className="mt-6 max-w-2xl leading-relaxed text-ink-muted">
                {profile.bio}
              </p>

              {/* 位置 */}
              <div className="mt-6 flex items-center gap-2 font-mono text-sm text-ink-faint">
                <MapPin className="h-4 w-4 text-neon-cyan" />
                {profile.location}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 时间线 */}
      <section className="section-py">
        <div className="container max-w-3xl">
          <SectionTitle
            eyebrow="TIMELINE"
            title="经历轨迹"
            description="从校园到赛场,从普通人到工程师。"
          />
          <Timeline items={profile.timeline} />
        </div>
      </section>

      {/* 技能 */}
      <section className="section-py border-t border-[var(--color-border)]">
        <div className="container max-w-4xl">
          <SectionTitle
            eyebrow="SKILLS"
            title="能力图谱"
            description="技能熟练度可视化展示。"
            align="center"
          />

          <div className="grid gap-8 sm:grid-cols-2">
            {Object.entries(categoryLabels).map(([catId, label], catIdx) => {
              const skills = profile.skills.filter(
                (s) => s.category === catId
              );
              if (skills.length === 0) return null;
              const color = categoryColors[catId];

              return (
                <ScrollReveal key={catId} delay={catIdx * 0.1}>
                  <div className="glass rounded-xl p-6">
                    <h3
                      className="mb-4 font-heading text-lg font-bold"
                      style={{ color }}
                    >
                      {label}
                    </h3>
                    <div className="space-y-4">
                      {skills.map((skill, i) => (
                        <div key={skill.name}>
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="font-heading text-sm text-white">
                              {skill.name}
                            </span>
                            <span
                              className="font-mono text-xs"
                              style={{ color }}
                            >
                              {skill.level}%
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: color }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 1,
                                delay: 0.2 + i * 0.1,
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

      {/* 联系方式 */}
      <section className="section-py border-t border-[var(--color-border)]">
        <div className="container max-w-3xl">
          <SectionTitle
            eyebrow="CONNECT"
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="glass glass-hover group flex items-center gap-4 rounded-xl p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 transition-colors group-hover:bg-neon-cyan/15">
                    <Icon className="h-5 w-5 text-neon-cyan" />
                  </div>
                  <div>
                    <div className="font-heading text-sm font-medium text-white">
                      {social.name}
                    </div>
                    <div className="mt-0.5 font-mono text-xs text-ink-faint">
                      {social.handle}
                    </div>
                  </div>
                  <ArrowDown className="ml-auto h-4 w-4 rotate-[-45deg] text-ink-faint transition-colors group-hover:text-neon-cyan" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
