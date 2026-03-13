import Link from "next/link";
import { Icon } from "./Icon";
import styles from "./ui.module.css";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function ActionLink({
  href,
  icon,
  children,
  accent = false,
  square = false,
  ariaLabel,
  className,
}) {
  return (
    <Link
      aria-label={ariaLabel ?? children}
      className={cx(
        styles.actionLink,
        accent && styles.actionLinkAccent,
        square && styles.actionLinkSquare,
        className,
      )}
      href={href}
    >
      {icon ? <Icon className={styles.actionIcon} name={icon} /> : null}
      {children ? <span>{children}</span> : null}
    </Link>
  );
}

export function BrutalLinkButton({
  href,
  icon,
  children,
  variant = "primary",
  size = "default",
}) {
  return (
    <Link
      className={cx(
        styles.buttonBase,
        variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary,
        size === "hero" && styles.buttonHero,
        size === "wide" && styles.buttonWide,
      )}
      href={href}
    >
      {icon ? <Icon className={styles.buttonIcon} name={icon} /> : null}
      <span>{children}</span>
    </Link>
  );
}

export function BrutalButton({
  onClick,
  icon,
  children,
  variant = "primary",
  size = "default",
  disabled = false,
}) {
  return (
    <button
      className={cx(
        styles.buttonBase,
        variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary,
        size === "hero" && styles.buttonHero,
        size === "wide" && styles.buttonWide,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? <Icon className={styles.buttonIcon} name={icon} /> : null}
      <span>{children}</span>
    </button>
  );
}
