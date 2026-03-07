type Props = {
  emoji: string;
  title: string;
  description: string;
};

export function EmptyState({ emoji, title, description }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-state-emoji">{emoji}</div>
      <h3>{title}</h3>
      <p className="muted">{description}</p>
    </div>
  );
}