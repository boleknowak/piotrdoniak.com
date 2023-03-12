import Image from 'next/image';

export default function Project({ project, ...props }) {
  return (
    <a href={project.url} target="_blank" className="project-item block" {...props}>
      <div className="flex transform flex-row items-start space-x-4 rounded border border-gray-200 bg-white p-4 transition duration-300 hover:scale-105 hover:bg-gray-100">
        <Image
          src={project.image}
          alt={project.title}
          width={64}
          height={64}
          className="rounded-md"
        />
        <div>
          <div className="-mt-1 text-lg font-bold">{project.title}</div>
          <div>{project.description}</div>
        </div>
      </div>
    </a>
  );
}
