import Layout from '@/components/Layouts/Layout';
import { Sofia } from 'next/font/google';
import Head from 'next/head';
import Social from '@/components/Social';
import { socials } from '@/lib/socials';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { BarLoader } from 'react-spinners';

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
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    } as ContactFields;

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

    setIsSubmitting(false);
    if (result.error) {
      if (!result.issues || result.issues?.length === 0) {
        toast(result.error, { autoClose: 3000, type: 'error' });
      } else {
        result.issues.forEach((issue: { name: never; code: never }) => {
          setErrors((prev) => ({ ...prev, [issue.name]: issue.code }));
        });
      }
    } else {
      toast(result.message, { autoClose: 3000, type: 'success' });

      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <>
      <Head>
        <title>{siteMeta?.title}</title>
        <meta name="description" content={siteMeta?.description} />
        <meta property="og:title" content={siteMeta?.title} />
        <meta property="og:description" content={siteMeta?.description} />
        <meta property="og:image" content={siteMeta?.image} />
        <meta property="og:url" content={siteMeta?.url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta property="twitter:domain" content="piotrdoniak.com" />
        <meta property="twitter:url" content={siteMeta?.url} />
        <meta name="twitter:title" content={siteMeta?.title} />
        <meta name="twitter:description" content={siteMeta?.description} />
        <meta name="twitter:image" content={siteMeta?.image} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div className="mb-20 mt-6 flex h-full w-full items-center justify-center md:mt-0">
          <div>
            <div className="w-full max-w-2xl text-[#43403C]">
              <h1 className="mb-4 text-2xl font-bold">Kontakt</h1>
              <div>
                <p>
                  Doszedłem do wniosku, że najlepszym sposobem na kontakt jest rozmowa z
                  człowiekiem, a nie z robotem. Dlatego, jeśli masz pytania, sugestie, lub chcesz po
                  prostu o <span className="italic">czymś</span> porozmawiać, napisz do mnie!
                  Odpowiem na każdą wiadomość, ręcznie - bez udziału robotów{' '}
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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
    image: 'https://piotrdoniak.com/images/brand/me.png',
    url: 'https://piotrdoniak.com/kontakt',
  };

  return {
    props: {
      siteMeta: meta,
    },
  };
};
