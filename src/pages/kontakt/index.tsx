import Layout from '@/components/Layouts/Layout';
import { Sofia } from 'next/font/google';
import Social from '@/components/Social';
import { socials } from '@/lib/socials';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Avatar from '@/components/Elements/Avatar';
import { delay } from '@/lib/helpers';
import SeoTags from '@/components/SeoTags';

const ERROR_TYPES = {
  too_small: 'Za krótkie (min. 2 znaki)',
  too_big: 'Za długie',
  invalid_string: 'Niepoprawny adres email',
  invalid_type: 'Coś poszło nie tak',
};

interface ContactFields {
  name: string;
  email: string;
  message: string;
}

const sofia = Sofia({ subsets: ['latin'], weight: '400' });

export default function Contact({ siteMeta }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [returningEmail, setReturningEmail] = useLocalStorage('remail', null);
  const [returningName, setReturningName] = useLocalStorage('rname', null);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    if (returningEmail) {
      setEmail(returningEmail);
    }

    if (returningName) {
      setName(returningName);
    }
  }, [returningEmail, returningName]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.loading('Wysyłanie...');

    const data = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    } as ContactFields;

    if (returningEmail) {
      data.email = returningEmail;
    }

    if (returningName) {
      data.name = returningName;
    }

    setErrors({
      name: '',
      email: '',
      message: '',
    });

    const response = await fetch('/api/contact/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    await delay(500);
    toast.dismiss();
    setIsSubmitting(false);

    if (result.error) {
      if (!result.issues || result.issues?.length === 0) {
        toast.error(result.error);
      } else {
        result.issues.forEach((issue: { name: never; code: never }) => {
          setErrors((prev) => ({ ...prev, [issue.name]: issue.code }));
        });
      }
    } else {
      setReturningEmail(data.email);
      setReturningName(data.name);

      toast.success(`${result.message} 🔥`);

      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <>
      <SeoTags title={siteMeta?.title} description={siteMeta?.description} url={siteMeta?.url} />
      <Layout>
        <div className="mb-20 mt-6 flex h-full w-full items-center justify-center md:mt-0">
          <div>
            <div className="w-full max-w-2xl text-[#43403C]">
              <h1 className="mb-4 text-2xl font-bold">Kontakt</h1>
              <div>
                <p>
                  Najlepszym sposobem na kontakt jest rozmowa z człowiekiem, a nie z robotem.
                  Dlatego, jeśli masz pytania, sugestie, lub chcesz po prostu o{' '}
                  <span className="italic">czymś</span> porozmawiać, napisz do mnie! Odpowiem na
                  każdą wiadomość, ręcznie - bez udziału robotów{' '}
                  <span className={sofia.className}>;)</span>
                </p>
              </div>
              <div className="mt-10">
                <div className="mb-2 font-bold">Social Media</div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {socials.map((social) => (
                    <Social key={social.id} social={social} source="kontakt" />
                  ))}
                </div>
              </div>
              <div className="mt-10">
                <div className="mb-2 font-bold">Formularz</div>
                <div>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    {returningEmail && returningName && (
                      <div className="flex flex-row items-start space-x-4 rounded-md bg-gray-100 p-4">
                        <Avatar alt={returningEmail} size={40} />
                        <div>
                          <span className="font-medium">Chcesz coś dopisać, {returningName}?</span>
                          <br />
                          <span className="text-sm text-gray-500">
                            Nie musisz ponownie podawać swojego adresu email! 😎
                          </span>
                          <div>
                            <button
                              type="button"
                              className="text-sm text-blue-500 hover:underline"
                              onClick={() => {
                                setReturningEmail(null);
                                setReturningName(null);
                                setEmail('');
                                setName('');
                              }}
                            >
                              To nie ja!
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {!(returningName && returningEmail) && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Twoja nazwa <span className="text-red-500">*</span>
                          </label>
                          <div>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              placeholder="np. Piotr"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className={`block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 ${
                                errors.name ? 'border-red-500' : ''
                              }`}
                            />
                            {errors.name && (
                              <div className="text-sm font-medium text-red-500">
                                {ERROR_TYPES[errors.name]}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Adres email <span className="text-red-500">*</span>
                          </label>
                          <div>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              placeholder="np. piotr@przykladowy.pl"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className={`block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 ${
                                errors.email ? 'border-red-500' : ''
                              }`}
                            />
                            {errors.email && (
                              <div className="text-sm font-medium text-red-500">
                                {ERROR_TYPES[errors.email]}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="space-y-1">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Wiadomość <span className="text-red-500">*</span>
                      </label>
                      <div>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          cols={50}
                          placeholder="Aa"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className={`block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 ${
                            errors.message ? 'border-red-500' : ''
                          }`}
                        ></textarea>
                        {errors.message && (
                          <div className="text-sm font-medium text-red-500">
                            {ERROR_TYPES[errors.message]}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`h-10 w-24 rounded-md bg-yellow-500 text-sm font-bold uppercase tracking-wide text-black hover:bg-yellow-600 ${
                          isSubmitting ? 'cursor-not-allowed bg-opacity-75' : ''
                        }`}
                      >
                        {!isSubmitting && <span>Wyślij</span>}
                        {isSubmitting && (
                          <div className="ml-4">
                            <BarLoader color="#212121" width={64} aria-label="Wysyłanie..." />
                          </div>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async () => {
  const meta = {
    title: 'Kontakt - Piotr Doniak',
    description: `Chcesz porozmawiać? Skontaktuj się ze mną, a ja odpowiem na Twoje pytania.`,
    url: 'https://piotrdoniak.com/kontakt',
  };

  return {
    props: {
      siteMeta: meta,
    },
  };
};
