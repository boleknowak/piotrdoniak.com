import Layout from '@/components/Layouts/Layout';
import { Sofia } from 'next/font/google';
import Social from '@/components/Social';
import { socials } from '@/lib/socials';
import { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Avatar from '@/components/Elements/Avatar';
import SeoTags from '@/components/SeoTags';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';

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
  const [errors, setErrors] = useState<ContactFields>({} as ContactFields);
  const toast = useToast();

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

    setIsSubmitting(false);

    if (result.error) {
      if (result.issues && result.issues?.length !== 0) {
        result.issues.forEach((issue: { name: never; code: never }) => {
          setErrors((prev) => ({ ...prev, [issue.name]: issue.code }));
        });
      }
    } else {
      setReturningEmail(data.email);
      setReturningName(data.name);
      setName('');
      setEmail('');
      setMessage('');
    }

    if (!(result.issues || result.issues?.length === 0)) {
      toast({
        title: result.message || result.error,
        status: !result.error ? 'success' : 'error',
        duration: !result.error ? 3000 : 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <SeoTags title={siteMeta?.title} description={siteMeta?.description} url={siteMeta?.url} />
      <Layout>
        <div className="mb-20 mt-6 flex h-full w-full items-center justify-center md:mt-0">
          <div>
            <div className="w-full max-w-2xl text-[#212121]">
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
                      <HStack spacing={4}>
                        <FormControl isInvalid={!!errors.name} id="name" isRequired>
                          <FormLabel>Twoja nazwa</FormLabel>
                          <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="np. Piotr"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                          <FormErrorMessage>{ERROR_TYPES[errors.name]}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.email} id="email" isRequired>
                          <FormLabel>Twój email</FormLabel>
                          <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="np. piotr@przykladowy.pl"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <FormErrorMessage>{ERROR_TYPES[errors.email]}</FormErrorMessage>
                        </FormControl>
                      </HStack>
                    )}
                    <FormControl isInvalid={!!errors.message} id="message" isRequired>
                      <FormLabel>Wiadomość</FormLabel>
                      <Textarea
                        name="message"
                        id="message"
                        placeholder="Aa"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <FormErrorMessage>{ERROR_TYPES[errors.message]}</FormErrorMessage>
                    </FormControl>
                    <div>
                      <Button type="submit" isLoading={isSubmitting} colorScheme="yellow">
                        Wyślij
                      </Button>
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
