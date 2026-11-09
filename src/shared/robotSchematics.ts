import type { RobotUnit } from './types';

export function getRobotSchematicSvg(svgType: RobotUnit['svgType']): string {
  switch (svgType) {
    case 'loader':
      return `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="#f5b700" stroke-width="2">
        <rect x="14" y="18" width="36" height="26" fill="#191f26" stroke="#d45527"/>
        <rect x="22" y="8" width="20" height="10" fill="#222a34"/>
        <circle cx="28" cy="13" r="2" fill="#f5b700"/>
        <circle cx="36" cy="13" r="2" fill="#f5b700"/>
        <path d="M6 24 H14 V38 H6 Z" fill="#222a34"/>
        <path d="M50 24 H58 V38 H50 Z" fill="#222a34"/>
        <rect x="12" y="46" width="16" height="10" rx="3" fill="#12161b" stroke="#f5b700"/>
        <rect x="36" y="46" width="16" height="10" rx="3" fill="#12161b" stroke="#f5b700"/>
      </svg>`;
    case 'core':
      return `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="#ef6d3d" stroke-width="2">
        <polygon points="32,6 56,19 56,45 32,58 8,45 8,19" fill="#12161b" stroke="#d45527"/>
        <circle cx="32" cy="32" r="12" fill="#222a34" stroke="#f5b700"/>
        <circle cx="32" cy="32" r="5" fill="#ef6d3d"/>
        <line x1="32" y1="6" x2="32" y2="20" stroke="#f5b700"/>
        <line x1="32" y1="44" x2="32" y2="58" stroke="#f5b700"/>
        <line x1="8" y1="19" x2="21" y2="26" stroke="#f5b700"/>
        <line x1="43" y1="38" x2="56" y2="45" stroke="#f5b700"/>
      </svg>`;
    case 'hound':
      return `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="#42d392" stroke-width="2">
        <polygon points="14,26 42,22 54,28 46,36 16,36" fill="#191f26" stroke="#f5b700"/>
        <circle cx="48" cy="28" r="3" fill="#ef6d3d"/>
        <path d="M18 36 L12 52 L18 52" stroke="#d45527" stroke-width="3"/>
        <path d="M28 36 L26 52 L32 52" stroke="#f5b700" stroke-width="2.5"/>
        <path d="M42 36 L48 52 L54 52" stroke="#d45527" stroke-width="3"/>
      </svg>`;
    case 'welder':
      return `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="#f5b700" stroke-width="2">
        <rect x="18" y="22" width="28" height="28" rx="2" fill="#191f26" stroke="#a2b0c0"/>
        <path d="M22 12 H42 L46 22 H18 Z" fill="#222a34" stroke="#d45527"/>
        <rect x="24" y="15" width="16" height="4" fill="#f5b700"/>
        <path d="M46 30 L58 22 L60 26" stroke="#ef6d3d" stroke-width="2.5"/>
        <circle cx="59" cy="21" r="3" fill="#ffd000"/>
      </svg>`;
    case 'medic':
      return `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="#f5b700" stroke-width="2">
        <rect x="16" y="14" width="32" height="36" rx="4" fill="#191f26" stroke="#f5b700"/>
        <path d="M32 22 V38 M24 30 H40" stroke="#ef6d3d" stroke-width="4"/>
        <rect x="24" y="6" width="16" height="8" fill="#222a34"/>
        <line x1="22" y1="50" x2="22" y2="58" stroke="#a2b0c0" stroke-width="3"/>
        <line x1="42" y1="50" x2="42" y2="58" stroke="#a2b0c0" stroke-width="3"/>
      </svg>`;
    case 'sentinel':
    default:
      return `<svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="#d45527" stroke-width="2">
        <rect x="10" y="14" width="44" height="32" fill="#191f26" stroke="#d45527"/>
        <line x1="16" y1="24" x2="48" y2="24" stroke="#f5b700" stroke-width="3"/>
        <rect x="16" y="32" width="12" height="8" fill="#12161b"/>
        <rect x="36" y="32" width="12" height="8" fill="#12161b"/>
        <rect x="8" y="46" width="48" height="10" fill="#12161b" stroke="#a2b0c0"/>
      </svg>`;
  }
}
