import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
import { UserInterface } from '@/interfaces/UserInterface';
import getMessages from '@/lib/getMessages';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Avatar from 'boring-avatars';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faClock,
  faEye,
  faFolderOpen,
  faPenToSquare,
} from '@fortawesome/free-regular-svg-icons';
import {
  faFolderClosed,
  faLeftLong,
  faClock as faClockSolid,
  faEnvelope,
  faCheck,
  faTrash,
  faEnvelopeCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import Date from '@/components/Date';
import Badge from '@/components/Elements/Badge';
import { useRouter } from 'next/router';

export default function PanelMessages() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState({
    id: undefined,
    name: undefined,
    email: undefined,
    message: undefined,
    status: undefined,
    createdAt: undefined,
  });
  const [showMessages, setShowMessages] = useLocalStorage('showMessages', 'all');
  const { data: session, status: authed } = useSession();
  const router = useRouter();
  const messagesData = getMessages({ onlyCount: false });

  useEffect(() => {
    if (messagesData.data) {
      setMessages(messagesData.data.messages);
      setIsLoading(false);
    }
  }, [messagesData.data]);

  useEffect(() => {
    if (messages.length !== 0) {
      if (showMessages === 'closed') {
        setFilteredMessages(messages.filter((message) => message.status !== 'CLOSED'));
      } else {
        setFilteredMessages(messages);
      }

      if (router.query.id) {
        const id = parseInt(router.query.id as string, 10);
        const forceSelectedMessage = messages.find((message) => message.id === id);
        if (forceSelectedMessage) {
          setSelectedMessage(forceSelectedMessage);
        }
      }
    }
  }, [messages, showMessages]);

  useEffect(() => {
    if (selectedMessage.id === undefined) return;

    router.push(`/panel/wiadomosci?id=${selectedMessage.id}`, undefined, { shallow: true });

    console.log('selectedMessage', selectedMessage);
    // TODO: Update message status to 'VIEWED' if it's 'PENDING'
  }, [selectedMessage]);

  if (authed === 'loading' || messagesData.loading || isLoading) return <LoadingPage />;
  const user = session?.user as UserInterface;

  if (messagesData.error) return <div>Wystąpił błąd</div>;

  const transformColorString = () => {
    const colors = '53ac59-3b8952-0f684b-03484c-1c232e';

    return colors.split('-').map((color) => `#${color}`);
  };

  const toggleShowMessages = () => {
    if (showMessages === 'all') {
      setShowMessages('closed');
    } else {
      setShowMessages('all');
    }
  };

  const getShowMessagesStatus = () => showMessages;

  const formatName = (name: string) => {
    const nameArray = name.split(' ');

    if (nameArray.length === 1) return nameArray[0];

    const firstName = nameArray[0];
    const lastName = nameArray[1];

    return `${firstName} ${lastName.charAt(0)}.`;
  };

  const markAsCompleted = (id: number) => {
    console.log('markAsCompleted', id);
  };

  const removeMessage = (id: number) => {
    console.log('removeMessage', id);
  };

  return (
    <>
      <Head>
        <title>Wiadomości - Panel - Piotr Doniak</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PanelLayout>
        <div className="-mt-2 mb-4 rounded border border-yellow-500 bg-yellow-50 p-4">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">
                Masz {filteredMessages?.length || 0}{' '}
                {(filteredMessages?.length || 0) !== 1 && <span>wiadomości</span>}
                {(filteredMessages?.length || 0) === 1 && <span>wiadomość</span>}
              </h1>
              <div>Kto do Ciebie napisał, {user?.firstName}? 😮</div>
            </div>
            <div>
              <button
                type="button"
                className="h-10 w-10 rounded bg-yellow-300"
                onClick={toggleShowMessages}
              >
                {getShowMessagesStatus() === 'closed' && (
                  <FontAwesomeIcon icon={faFolderOpen} size="lg" className="w-5" />
                )}
                {getShowMessagesStatus() === 'all' && (
                  <FontAwesomeIcon icon={faFolderClosed} size="lg" className="w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="flex w-full flex-grow flex-row space-x-4">
            <div className="contact-height w-96 space-y-2">
              <div className="font-bold uppercase">Lista</div>
              {filteredMessages.length === 0 && (
                <div className="mx-auto pt-20 text-center">
                  <FontAwesomeIcon icon={faEnvelopeCircleCheck} size="2xl" className="w-12" />
                  <div className="mt-1 text-lg font-medium">Coś cicho, za cicho...</div>
                </div>
              )}
              {filteredMessages.length !== 0 && (
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <button
                      type="button"
                      key={message.id}
                      className={`block w-full rounded-lg bg-gray-100 p-4 text-left ${
                        selectedMessage.id === message.id && '!bg-yellow-50'
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center space-x-4">
                          <Avatar
                            size={40}
                            name={message.email}
                            variant="beam"
                            colors={transformColorString()}
                          />
                          <div>
                            <div className="font-bold">{formatName(message.name)}</div>
                            <div className="text-xs text-gray-500">
                              <Date dateString={message.createdAt} />
                            </div>
                          </div>
                        </div>
                        <div>
                          {message.status === 'PENDING' && (
                            <FontAwesomeIcon
                              icon={faClock}
                              size="lg"
                              className="w-5 text-yellow-600"
                            />
                          )}
                          {message.status === 'CLOSED' && (
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              size="lg"
                              className="w-5 text-green-600"
                            />
                          )}
                          {message.status === 'VIEWED' && (
                            <FontAwesomeIcon icon={faEye} size="lg" className="w-5 text-blue-600" />
                          )}
                          {message.status === 'DRAFT' && (
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              size="lg"
                              className="w-5 text-purple-600"
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full rounded-md bg-gray-100 p-4">
              {selectedMessage.id === undefined && (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="mx-auto text-center">
                    <FontAwesomeIcon icon={faLeftLong} size="4x" className="w-12" />
                    <div className="text-lg font-medium">Wybierz wiadomość</div>
                  </div>
                </div>
              )}
              {selectedMessage.id !== undefined && (
                <div>
                  <div className="flex flex-row items-center space-x-4">
                    <Avatar
                      size={40}
                      name={selectedMessage.email}
                      variant="beam"
                      colors={transformColorString()}
                    />
                    <div>
                      <div className="font-bold">{selectedMessage.name}</div>
                      <div className="flex mt-1 flex-row items-center space-x-2">
                        <Badge
                          variant="outlined-gray"
                          additionalClasses="flex flex-row items-center space-x-1"
                        >
                          <FontAwesomeIcon icon={faClockSolid} size="sm" className="-ml-1 w-3" />
                          <Date dateString={selectedMessage.createdAt} />
                        </Badge>
                        <Badge
                          variant="outlined-gray"
                          additionalClasses="flex flex-row items-center space-x-1"
                        >
                          <FontAwesomeIcon icon={faEnvelope} size="sm" className="-ml-1 w-3" />
                          <div>{selectedMessage.email}</div>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-md bg-white p-4">
                    {selectedMessage.message.split('\n').map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                  <div className="flex mt-4 flex-row items-center space-x-4">
                    <button
                      type="button"
                      className="flex flex-row items-center space-x-2 rounded-md border border-yellow-300 bg-yellow-300 px-3 py-2 text-sm"
                      onClick={() => markAsCompleted(selectedMessage.id)}
                    >
                      <FontAwesomeIcon icon={faCheck} size="lg" className="w-5" />
                      <div>Oznacz jako zakończone</div>
                    </button>
                    <button
                      type="button"
                      className="flex flex-row items-center space-x-2 rounded-md border border-red-500 px-3 py-2 text-sm text-red-500"
                      onClick={() => removeMessage(selectedMessage.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} size="lg" className="w-5" />
                      <div>Usuń na zawsze</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PanelLayout>
    </>
  );
}
