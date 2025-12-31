// Environment indicator colors used across the application
export const ENV_COLORS = {
	red: '#ef4444',
	orange: '#f97316',
	yellow: '#eab308',
	green: '#22c55e',
	blue: '#3b82f6',
	purple: '#a855f7',
	pink: '#ec4899'
} as const;

// Type for environment color keys
export type EnvColorKey = keyof typeof ENV_COLORS;

// Color options for UI components
export const ENV_COLOR_OPTIONS = [
	{ value: 'red', color: ENV_COLORS.red },
	{ value: 'orange', color: ENV_COLORS.orange },
	{ value: 'yellow', color: ENV_COLORS.yellow },
	{ value: 'green', color: ENV_COLORS.green },
	{ value: 'blue', color: ENV_COLORS.blue },
	{ value: 'purple', color: ENV_COLORS.purple },
	{ value: 'pink', color: ENV_COLORS.pink }
] as const;

// Default environment color
export const DEFAULT_ENV_COLOR: EnvColorKey = 'blue';

// Elasticsearch cluster status colors
export const CLUSTER_STATUS_COLORS = {
	green: '#22c55e',
	yellow: '#eab308',
	red: '#ef4444'
} as const;

// Type for cluster status
export type ClusterStatus = keyof typeof CLUSTER_STATUS_COLORS;
