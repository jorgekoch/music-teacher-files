import { Link } from "react-router-dom";

type Props = {
  items: { label: string; to?: string }[];
};

export function SeoBreadcrumbs({ items }: Props) {
  return (
    <nav className="seo-breadcrumbs">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="seo-breadcrumbs__item">
            {item.to && !isLast ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span className="seo-breadcrumbs__current">
                {item.label}
              </span>
            )}

            {!isLast && <span className="seo-breadcrumbs__separator"> / </span>}
          </span>
        );
      })}
    </nav>
  );
}