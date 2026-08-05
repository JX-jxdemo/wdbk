import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { profile } from "@/data/profile";

const categoryConfig: Record<
  string,
  { label: string; color: string; glow: string }
> = {
  frontend: {
    label: "Frontend",
    color: "text-neon-cyan",
    glow: "hover:shadow-neon-cyan hover:border-neon-cyan/50",
  },
  backend: {
    label: "Backend",
    color: "text-neon-magenta",
    glow: "hover:shadow-neon-magenta hover:border-neon-magenta/50",
  },
  design: {
    label: "Design",
    color: "text-neon-purple",
    glow: "hover:shadow-neon-purple hover:border-neon-purple/50",
  },
  tools: {
    label: "Tools",
    color: "text-neon-green",
    glow: "hover:border-neon-green/50",
  },
};

export default function SkillsMatrix() {
  return (
    <section className="section-py">
      <div className="container">
        <SectionTitle
          eyebrow="CAPABILITY"
          title="技能矩阵"
          description="横跨前端、后端、设计与工具链的技术能力图谱。"
          align="center"
        />

        <div className="mx-auto max-w-4xl space-y-8">
          {Object.entries(categoryConfig).map(([catId, config], catIndex) => {
            const skills = profile.skills.filter((s) => s.category === catId);
            if (skills.length === 0) return null;

            return (
              <ScrollReveal key={catId} delay={catIndex * 0.1}>
                <div className="glass rounded-xl p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className={`font-mono text-sm ${config.color}`}>
                      [{config.label}]
                    </span>
                    <div className="h-px flex-1 bg-[var(--color-border)]" />
                    <span className="font-mono text-xs text-ink-faint">
                      {skills.length} skills
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className={`glass glass-hover cursor-default rounded-lg border px-4 py-2.5 ${config.glow}`}
                      >
                        <div className="font-heading text-sm font-medium text-white">
                          {skill.name}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <div className="h-1 w-16 overflow-hidden rounded-full bg-white/5">
                            <motion.div
                              className={`h-full ${config.color.replace("text-", "bg-")}`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
                            />
                          </div>
                          <span className={`font-mono text-xs ${config.color}`}>
                            {skill.level}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/about"
            className="group inline-flex items-center gap-2 border border-neon-cyan/40 px-7 py-3 font-mono text-sm text-neon-cyan transition-all hover:bg-neon-cyan/10 hover:shadow-neon-cyan"
          >
            查看完整简历
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
