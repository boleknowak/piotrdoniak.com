type Props = {
  children: React.ReactNode;
  variant?: 'warning' | 'success' | 'error' | 'outlined-gray';
  additionalClasses?: string;
};

export default function Badge({ children, variant = 'warning', additionalClasses = '' }: Props) {
  const variants = {
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'outlined-gray':
      'border border-gray-500 bg-gray-100  text-gray-800 dark:bg-gray-700 dark:text-gray-400',
  };

  const classes = `text-xs font-medium px-2.5 py-0.5 rounded ${variants[variant]} ${additionalClasses}`;

  return <span className={classes}>{children}</span>;
}
