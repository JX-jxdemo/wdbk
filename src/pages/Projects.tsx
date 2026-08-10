import { motion } from "framer-motion";
import { ExternalLink, Github, Calendar } from "lucide-react";
import { projects } from "@/data/projects";
import SectionTitle from "@/components/shared/SectionTitle";
import GradientCover from "@/components/shared/GradientCover";
import Tag from "@/components/ui/Tag";
import type { Project } from "@/types";

const statusConfig: Record<
  Project["status"],
  { label: string; color: string }
> = {
  live: { label: "在线", color: "#22c55e" },
  wip: { label: "开发中", color: "#f59e0b" },
  archived: { label: "已归档", color: "#71717a" },
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const status = statusConfig[project.status];

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass glass-hover group flex flex-col overflow-hidden rounded-xl"
    >
      {/* 截图 */}
      <div className="aspect-[16/9]">
        <GradientCover cover={project.screenshot} className="h-full w-full">
          {/* 状态标签 */}
          <span
            className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-xs backdrop-blur-sm"
            style={{
              color: status.color,
              borderColor: `${status.color}66`,
              backgroundColor: `${status.color}1a`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: status.color }}
            />
            {status.label}
          </span>

          {/* 年份 */}
          <span className="absolute right-4 top-4 z-10 font-mono text-xs text-white/60">
            {project.year}
          </span>

          {/* 项目名水印 */}
          <div className="absolute bottom-4 left-4 z-[1] font-heading text-2xl font-black text-white/15">
            {project.title}
          </div>
        </GradientCover>
      </div>

      {/* 内容 */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--color-primary)]">
          {project.title}
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
          {project.description}
        </p>

        {/* 技术栈 */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <Tag key={tech} color="purple">
              {tech}
            </Tag>
          ))}
        </div>

        {/* 链接 */}
        <div className="mt-5 flex items-center gap-3 border-t border-[var(--color-border)] pt-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs text-[var(--color-primary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              演示
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--color-primary)]"
            >
              <Github className="h-3.5 w-3.5" />
              源码
            </a>
          )}
          <span className="ml-auto flex items-center gap-1 font-mono text-xs text-[var(--text-faint)]">
            <Calendar className="h-3 w-3" />
            {project.year}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <div className="relative z-20 bg-[rgba(30,41,59,0.55)] pt-24 backdrop-blur-[10px]">
      {/* Banner */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f97316] to-transparent" />

        <div className="container relative z-10 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[#f97316]"
          >
            <span className="h-px w-8 bg-[#f97316] shadow-card-hover" />
            SHOWCASE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl font-black text-[var(--text-primary)] sm:text-5xl md:text-6xl"
          >
            项目<span className="text-[var(--color-primary)]">作品集</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl text-[var(--text-secondary)]"
          >
            共 {projects.length} 个项目 · 从 Web 应用到创意实验,探索技术的边界
          </motion.p>
        </div>
      </section>

      {/* 项目网格 */}
      <section className="section-py">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}