import Hero from "@/components/home/Hero";
import StatsSection from "@/components/home/StatsSection";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import SkillsMatrix from "@/components/home/SkillsMatrix";
import CTASection from "@/components/home/CTASection";
// 公告专区（独立模块，删除下方两行即可移除）
import NoticeSection from "@/components/notice/NoticeSection";

export default function Home() {
  return (
    <>
      <Hero />
      <NoticeSection />
      <StatsSection />
      <FeaturedArticles />
      <SkillsMatrix />
      <CTASection />
    </>
  );
}
