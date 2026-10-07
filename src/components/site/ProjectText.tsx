import React from "react";
import { ArrowUpRight } from "lucide-react";
import { MaskedLine } from "./TextBlocks";
import type { ProjectItem } from "@/data/archive";

/* ============================================================================
 * 项目文字自述 (Project Narrative Block)
 * ----------------------------------------------------------------------------
 * 数据驱动：标签行 / 中英标题 / 定位语 / 描述 / 规格行 / 外链组，
 * 01–09 全部项目共用同一结构，差异仅由 props 表达。
 * ==========================================================================*/

const LINK_LABELS: [keyof ProjectItem["links"], string][] = [
  ["demo", "在线访问"],
  ["quark", "夸克网盘下载"],
  ["github", "GitHub 仓库"],
  ["release", "Release 下载"],
];

export interface ExtraLink {
  href: string;
  label: string;
}

/** 外链组：首枚为主链接（白字下划线），其余为次级灰链 */
export function ProjectLinks({
  project,
  extra = [],
}: {
  project: ProjectItem;
  extra?: ExtraLink[];
}) {
  const items: ExtraLink[] = [
    ...extra,
    ...LINK_LABELS.filter(([key]) => project.links[key]).map(([key, label]) => ({
      href: project.links[key]!,
      label,
    })),
  ];
  if (items.length === 0) return null;

  return (
    <div className="pt-2 flex flex-wrap items-center gap-5 sm:gap-6 font-mono text-xs">
      {items.map((link, i) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`transition-colors flex items-center gap-1 group ${
            i === 0
              ? "text-white underline underline-offset-4 hover:text-neutral-300"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <span>{link.label}</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      ))}
    </div>
  );
}

/**
 * 项目文字栈：标签 / 标题 / 定位语 / 描述 / 规格 / 外链。
 * `size` 对应图版级项目（大）与纯文字级项目（中）两套字号。
 */
export function ProjectText({
  label,
  project,
  spec,
  extraLinks,
  size = "md",
  children,
}: {
  label: string;
  project: ProjectItem;
  spec?: string;
  extraLinks?: ExtraLink[];
  size?: "lg" | "md";
  children?: React.ReactNode;
}) {
  const Heading = size === "lg" ? "h2" : "h3";
  const hasLinks = (extraLinks?.length ?? 0) > 0 || Object.values(project.links).some(Boolean);
  const base = 4 + (spec ? 1 : 0); // 后续 MaskedLine 的起始序号

  return (
    <>
      <MaskedLine i={0}>
        <div className="font-mono text-xs text-neutral-500 tracking-wider">
          {label}
        </div>
      </MaskedLine>

      <MaskedLine i={1}>
        <Heading
          className={`${
            size === "lg" ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
          } font-light text-white tracking-tight flex items-baseline flex-wrap gap-2`}
        >
          <span>{project.title}</span>
          <span className="text-xs font-mono text-neutral-500 font-normal">/ {project.englishTitle}</span>
        </Heading>
      </MaskedLine>

      <MaskedLine i={2}>
        <p className="text-xs sm:text-[13px] text-neutral-300 font-light leading-relaxed">
          {project.tagline}
        </p>
      </MaskedLine>

      <MaskedLine i={3}>
        <p className="text-xs text-neutral-400 font-light leading-relaxed">
          {project.description}
        </p>
      </MaskedLine>

      {spec && (
        <MaskedLine i={4}>
          <div className="font-mono text-xs text-neutral-500 pt-1">{spec}</div>
        </MaskedLine>
      )}

      {children}

      {hasLinks && (
        <MaskedLine i={base + React.Children.count(children)}>
          <ProjectLinks project={project} extra={extraLinks} />
        </MaskedLine>
      )}
    </>
  );
}
