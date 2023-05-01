import { Sofia } from 'next/font/google';

const sofia = Sofia({ subsets: ['latin'], weight: '400' });

export default function FontWrapper({ children, font }) {
  let classNames = '';

  if (font === 'sofia') {
    classNames = sofia.className;
  }

  return <span className={classNames}>{children}</span>;
}
