import Link from 'next/link';
import { cn } from '@/lib/utils';
import styles from '@/app/styles/abuttonShine.module.css'

type AButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: React.ReactNode;
}

const AButton = ({ children, className = "", href = "#", ...props }: AButtonProps) => {
  return (
    <Link href={href} className={cn("inline-block p-2 pl-8 pr-8 mt-5 btn border rounded-[7px]", styles.btnShine, className)} {...props}>
        {children}
    </Link>
  );
};

export default AButton;