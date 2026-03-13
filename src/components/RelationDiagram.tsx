"use client";

import { useState } from "react";
import type { RelationCharacter, Relationship, RelationType } from "@/lib/relations-data";
import { RELATION_TYPE_META } from "@/lib/relations-data";

interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
}

interface Props {
  characters: RelationCharacter[];
  relationships: Relationship[];
  imageBase: string;
  cast: CastMember[];
}

const SVG_W = 700;
const SVG_H = 600;
const NODE_R = 30;
const NODE_R_PROT = 38;

function toSvg(x: number, y: number): [number, number] {
  return [(x / 100) * (SVG_W - 120) + 60, (y / 100) * (SVG_H - 160) + 60];
}

function bezierMid(
  x1: number, y1: number, x2: number, y2: number, idx: number
): { cx: number; cy: number; mx: number; my: number; path: string } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  // 同じノード間に複数エッジがある場合を考慮してidxでオフセット
  const base = Math.min(0.22, 35 / len);
  const curvature = base * (1 + idx * 0.15);
  const nx = -dy * curvature;
  const ny = dx * curvature;
  const cx = (x1 + x2) / 2 + nx;
  const cy = (y1 + y2) / 2 + ny;
  const mx = (x1 + 2 * cx + x2) / 4;
  const my = (y1 + 2 * cy + y2) / 4;
  const path = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  return { cx, cy, mx, my, path };
}

// 俳優名でキャストを検索
function findCastProfile(cast: CastMember[], actorName: string): string | null {
  if (!actorName) return null;
  const exact = cast.find((c) => c.name === actorName);
  if (exact) return exact.profile_path;
  const partial = cast.find((c) =>
    c.name.includes(actorName) || actorName.includes(c.name)
  );
  return partial?.profile_path ?? null;
}

export default function RelationDiagram({ characters, relationships, imageBase, cast }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const charMap = new Map(characters.map((c) => [c.id, c]));

  const profileMap = new Map<string, string | null>();
  for (const c of characters) {
    profileMap.set(c.id, findCastProfile(cast, c.actorName));
  }

  const isRelated = (rel: Relationship) =>
    selected === null || rel.from === selected || rel.to === selected;

  const isNodeRelated = (charId: string) => {
    if (selected === null) return true;
    if (charId === selected) return true;
    return relationships.some(
      (r) => (r.from === selected && r.to === charId) || (r.to === selected && r.from === charId)
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full max-w-[700px]"
        style={{ touchAction: "manipulation" }}
      >
        <defs>
          {/* 背景グラデーション */}
          <radialGradient id="bg-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </radialGradient>
          {/* ノードシャドウ */}
          <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.12" />
          </filter>
          {/* 主人公グロー */}
          <filter id="prot-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.35" />
          </filter>
          {/* 選択グロー */}
          <filter id="sel-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#3b82f6" floodOpacity="0.4" />
          </filter>
          {/* 矢印マーカー（各色） */}
          {(Object.entries(RELATION_TYPE_META) as [RelationType, { color: string; label: string }][]).map(
            ([type, meta]) => (
              <marker
                key={`arrow-${type}`}
                id={`arrow-${type}`}
                viewBox="0 0 10 8"
                refX="8"
                refY="4"
                markerWidth="8"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 4 L 0 8 z" fill={meta.color} opacity={0.6} />
              </marker>
            )
          )}
          {/* クリップパス */}
          {characters.map((c) => {
            const r = c.isProtagonist ? NODE_R_PROT : NODE_R;
            const [sx, sy] = toSvg(c.x, c.y);
            return (
              <clipPath key={`clip-${c.id}`} id={`clip-${c.id}`}>
                <circle cx={sx} cy={sy} r={r - 2} />
              </clipPath>
            );
          })}
        </defs>

        {/* 背景 */}
        <rect x="0" y="0" width={SVG_W} height={SVG_H} rx="16" fill="url(#bg-grad)" />

        {/* Edges */}
        {relationships.map((rel, i) => {
          const fromChar = charMap.get(rel.from);
          const toChar = charMap.get(rel.to);
          if (!fromChar || !toChar) return null;
          const [x1, y1] = toSvg(fromChar.x, fromChar.y);
          const [x2, y2] = toSvg(toChar.x, toChar.y);
          const { mx, my, path } = bezierMid(x1, y1, x2, y2, i);
          const meta = RELATION_TYPE_META[rel.type];
          const active = isRelated(rel);
          const highlighted = active && selected !== null;
          return (
            <g key={`edge-${i}`} style={{ transition: "opacity 0.25s ease" }} opacity={active ? 1 : 0.08}>
              {/* エッジ線 */}
              <path
                d={path}
                fill="none"
                stroke={meta.color}
                strokeWidth={highlighted ? 3 : 1.8}
                strokeLinecap="round"
                strokeDasharray={rel.type === "neutral" ? "6 4" : "none"}
                opacity={highlighted ? 0.9 : 0.55}
                markerEnd={`url(#arrow-${rel.type})`}
              />
              {/* ラベル背景 pill */}
              <foreignObject
                x={mx - 50}
                y={my - 11}
                width={100}
                height={22}
                style={{ overflow: "visible", pointerEvents: "none" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: 10,
                      fontSize: 10,
                      fontWeight: 600,
                      color: meta.color,
                      backgroundColor: "white",
                      border: `1.2px solid ${meta.color}`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      whiteSpace: "nowrap",
                      lineHeight: "16px",
                    }}
                  >
                    {rel.label}
                  </span>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Nodes */}
        {characters.map((c) => {
          const r = c.isProtagonist ? NODE_R_PROT : NODE_R;
          const [sx, sy] = toSvg(c.x, c.y);
          const profilePath = profileMap.get(c.id);
          const active = isNodeRelated(c.id);
          const isSelected = selected === c.id;
          const filterId = isSelected
            ? "url(#sel-glow)"
            : c.isProtagonist
              ? "url(#prot-glow)"
              : "url(#node-shadow)";
          return (
            <g
              key={`node-${c.id}`}
              style={{ transition: "opacity 0.25s ease" }}
              opacity={active ? 1 : 0.12}
              className="cursor-pointer"
              onClick={() => setSelected(selected === c.id ? null : c.id)}
            >
              {/* 外側リング＋シャドウ/グロー */}
              <circle
                cx={sx}
                cy={sy}
                r={r + 3}
                fill="white"
                filter={filterId}
              />
              {/* グラデーション枠線 */}
              <circle
                cx={sx}
                cy={sy}
                r={r + 1.5}
                fill="none"
                stroke={isSelected ? "#3b82f6" : c.isProtagonist ? "#f59e0b" : "#e5e7eb"}
                strokeWidth={isSelected ? 3 : c.isProtagonist ? 2.5 : 1.5}
              />
              {/* 写真 or フォールバック */}
              {profilePath ? (
                <image
                  href={`${imageBase}/w185${profilePath}`}
                  x={sx - r + 2}
                  y={sy - r + 2}
                  width={(r - 2) * 2}
                  height={(r - 2) * 2}
                  clipPath={`url(#clip-${c.id})`}
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                <>
                  <circle cx={sx} cy={sy} r={r - 2} fill="#f3f4f6" />
                  <text x={sx} y={sy + 5} textAnchor="middle" fontSize={16} fill="#9ca3af">
                    {c.name[0]}
                  </text>
                </>
              )}
              {/* 主人公バッジ */}
              {c.isProtagonist && (
                <>
                  <circle cx={sx + r - 4} cy={sy - r + 6} r={7} fill="#f59e0b" />
                  <text
                    x={sx + r - 4}
                    y={sy - r + 10}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={700}
                    fill="white"
                  >
                    ★
                  </text>
                </>
              )}
              {/* キャラ名（背景付き） */}
              <rect
                x={sx - c.name.length * 5.5 - 4}
                y={sy + r + 5}
                width={c.name.length * 11 + 8}
                height={16}
                rx={4}
                fill="white"
                opacity={0.85}
              />
              <text
                x={sx}
                y={sy + r + 17}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill="#111827"
              >
                {c.name}
              </text>
              {/* 俳優名 */}
              {c.actorName && (
                <text
                  x={sx}
                  y={sy + r + 30}
                  textAnchor="middle"
                  fontSize={8.5}
                  fill="#9ca3af"
                >
                  {c.actorName}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* 凡例 */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3 px-4">
        {(Object.entries(RELATION_TYPE_META) as [RelationType, { color: string; label: string }][]).map(
          ([type, meta]) => (
            <div key={type} className="flex items-center gap-1.5">
              <svg width="20" height="8">
                <line
                  x1="0" y1="4" x2="20" y2="4"
                  stroke={meta.color}
                  strokeWidth={2}
                  strokeDasharray={type === "neutral" ? "4 3" : "none"}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[11px] text-gray-500">{meta.label}</span>
            </div>
          )
        )}
      </div>

      {selected !== null && (
        <button
          onClick={() => setSelected(null)}
          className="mt-2 text-xs text-gray-400 underline hover:text-gray-600 transition-colors"
        >
          選択解除
        </button>
      )}
    </div>
  );
}
