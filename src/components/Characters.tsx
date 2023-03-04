import Image from 'next/image';

export default function Characters({ data }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.results.map((character) => (
        <div key={character.id}>
          <h1 className="truncate text-center">{character.name}</h1>
          <Image
            src={character.image}
            width={200}
            height={200}
            alt={character.name}
            className="rounded-md"
          />
        </div>
      ))}
    </div>
  );
}
