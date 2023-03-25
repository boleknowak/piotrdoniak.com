// eslint-disable-next-line import/no-named-default
import { default as BoringAvatarComponent } from 'boring-avatars';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
  [key: string]: unknown;
}

export default function Avatar({ src, alt, size = 32, ...props }: AvatarProps) {
  const transformColorString = () => {
    const colors = '53ac59-3b8952-0f684b-03484c-1c232e';

    return colors.split('-').map((color) => `#${color}`);
  };

  if (!src) {
    return (
      <BoringAvatarComponent
        size={size}
        name={alt}
        variant="beam"
        colors={transformColorString()}
      />
    );
  }

  return <Image src={src} alt={alt} width={size} height={size} {...props} />;
}
