import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Prop = {
  icon: LucideIcon;
  label: string;
  href?: string;
}

export function NavButton({ icon: Icon, label, href }: Prop) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className="rounded-full cursor-pointer"
      asChild
    >
      {
        href ? (
          <Link href={href}>
            <Icon />
          </Link>
        ) : (
          <Icon />
        )
      }
    </Button>
  )
}