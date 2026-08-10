import { useEffect, useState } from "react";
import { Save, RefreshCw, Cake, Send } from "lucide-react";
import { apiFetch } from "@/contexts/AuthContext";
import { useSite } from "@/contexts/SiteContext";

interface Settings {
  registrationEnabled: boolean;
  likeModuleEnabled: boolean;
  noticeModuleEnabled: boolean;
  musicModuleEnabled: boolean;
  birthdayAutoEnabled: boolean;
  birthdayPreTemplate: string;
  birthdayDayTemplate: string;
  birthdayPostTemplate: string;
}

export default function AdminSettings() {
  const { refresh: refreshSite } = useSite();
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => {
    apiFetch<Settings>("/admin/settings").then(setS);
  };

  useEffect(load, []);

  const save = async () => {
    if (!s) return;
    setSaving(true);
    try {
      const r = await apiFetch<Settings>("/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(s),
      });
      setS(r);
      refreshSite();
      setMsg("保存成功");
    } catch (e: any) {
      setMsg(e.message || "保存失败");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 2000);
    }
  };

  const runBirthday = async () => {
    setMsg("执行中...");
    try {
      const r = await apiFetch<any>("/admin/run-birthday-job", {
        method: "POST",
      });
      setMsg(`生日任务完成: 创建 ${r.created || 0} 条, 归档 ${r.archived || 0} 条`);
    } catch (e: any) {
      setMsg(e.message || "执行失败");
    }
  };

  if (!s) return <div className="text-ink-muted">加载中...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">站点设置</h1>
        <button
          onClick={save}
          disabled={saving}
          className="rounded border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 px-4 py-2 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存设置"}
        </button>
      </div>

      {msg && (
        <div className="mb-4 rounded border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-2 text-sm text-[var(--color-primary)]">
          {msg}
        </div>
      )}

      {/* 模块开关 */}
      <div className="glass mb-4 rounded-xl p-5">
        <h3 className="mb-4 font-bold text-[var(--text-primary)]">模块开关</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle
            label="允许注册"
            desc="关闭后注册接口返回 403"
            checked={s.registrationEnabled}
            onChange={(v) => setS({ ...s, registrationEnabled: v })}
          />
          <Toggle
            label="好感度模块"
            desc="关闭后 /like 返回 404，导航隐藏"
            checked={s.likeModuleEnabled}
            onChange={(v) => setS({ ...s, likeModuleEnabled: v })}
          />
          <Toggle
            label="公告系统"
            desc="关闭后顶部横幅与首页公告区不显示"
            checked={s.noticeModuleEnabled}
            onChange={(v) => setS({ ...s, noticeModuleEnabled: v })}
          />
          <Toggle
            label="音乐播放器"
            desc="关闭后右下角播放器不渲染"
            checked={s.musicModuleEnabled}
            onChange={(v) => setS({ ...s, musicModuleEnabled: v })}
          />
          <Toggle
            label="生日自动公告"
            desc="关闭后定时任务不再生成新公告"
            checked={s.birthdayAutoEnabled}
            onChange={(v) => setS({ ...s, birthdayAutoEnabled: v })}
          />
        </div>
      </div>

      {/* 生日模板 */}
      <div className="glass mb-4 rounded-xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
            <Cake className="h-4 w-4 text-[#f97316]" />
            生日周三阶段模板
          </h3>
          <button
            onClick={runBirthday}
            className="flex items-center gap-1 rounded border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 px-3 py-1 text-xs text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20"
          >
            <RefreshCw className="h-3 w-3" /> 手动触发任务
          </button>
        </div>
        <p className="mb-3 text-xs text-[var(--text-secondary)]">
          模板变量 <code className="text-[var(--color-primary)]">{"{username}"}</code> 会被替换为用户名。
          生日周：前 3 天私信预热 → 当天全站公告 → 后 3 天持续展示。
        </p>
        <div className="space-y-3">
          <TemplateInput
            label="前 3 天预热（私信）"
            value={s.birthdayPreTemplate}
            onChange={(v) => setS({ ...s, birthdayPreTemplate: v })}
          />
          <TemplateInput
            label="当天公告（全站）"
            value={s.birthdayDayTemplate}
            onChange={(v) => setS({ ...s, birthdayDayTemplate: v })}
          />
          <TemplateInput
            label="后 3 天持续（全站）"
            value={s.birthdayPostTemplate}
            onChange={(v) => setS({ ...s, birthdayPostTemplate: v })}
          />
        </div>
      </div>

      <div className="glass rounded-xl p-5">
        <h3 className="mb-3 flex items-center gap-2 font-bold text-[var(--text-primary)]">
          <Send className="h-4 w-4 text-[var(--color-primary)]" />
          模块说明
        </h3>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          <li>· 账号系统、播放器、好感度、公告生日模块互相独立</li>
          <li>· 各模块可单独启用 / 关闭 / 卸载</li>
          <li>· 卸载方式：删除对应前端文件夹 + 移除 Layout 引入 + 删除对应后端路由 + DROP 数据表</li>
          <li>· 后端定时任务每日 00:30 自动遍历用户生日生成 / 归档公告</li>
        </ul>
      </div>
    </div>
  );
}

function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded border border-[var(--color-border)] p-3 hover:border-[var(--color-border-hover)]">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`mt-0.5 flex h-6 w-11 flex-shrink-0 items-center rounded-full p-0.5 transition ${
          checked ? "bg-[var(--color-primary)]/30" : "bg-[var(--color-surface-2)]"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-[var(--text-primary)] transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <div className="flex-1">
        <div className="font-bold text-[var(--text-primary)]">{label}</div>
        <div className="text-xs text-[var(--text-secondary)]">{desc}</div>
      </div>
    </label>
  );
}

function TemplateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-[var(--color-primary)]">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 text-sm text-[var(--text-primary)]"
      />
    </div>
  );
}
