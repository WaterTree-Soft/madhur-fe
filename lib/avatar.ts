const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #8b5cf6, #6366f1)",
  "linear-gradient(135deg, #f43f5e, #ec4899)",
  "linear-gradient(135deg, #f59e0b, #f97316)",
  "linear-gradient(135deg, #10b981, #14b8a6)",
  "linear-gradient(135deg, #0ea5e9, #3b82f6)",
  "linear-gradient(135deg, #e879f9, #a855f7)",
  "linear-gradient(135deg, #84cc16, #22c55e)",
  "linear-gradient(135deg, #ef4444, #f43f5e)",
];

export function getAvatarGradient(name: string): string {
  const index =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index]!;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
