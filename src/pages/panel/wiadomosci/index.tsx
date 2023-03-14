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
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';
import { faFolderClosed } from '@fortawesome/free-solid-svg-icons';

export default function PanelMessages() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMessages, setShowMessages] = useLocalStorage('showMessages', 'all');
  const { data: session, status: authed } = useSession();
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
    }
  }, [messages, showMessages]);

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
          {filteredMessages.length !== 0 && (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div key={message.id} className="rounded-lg bg-gray-100 p-4">
                  <div className="flex flex-row items-center space-x-4">
                    <Avatar
                      size={40}
                      name={message.email}
                      variant="beam"
                      colors={transformColorString()}
                    />
                    <div>
                      <div className="font-bold">{message.name}</div>
                      <div>
                        {message.status === 'CLOSED' && <span>Zamknięte</span>}
                        {message.status === 'VIEWED' && <span>Wyświetlone</span>}
                        {message.status === 'PENDING' && <span>Oczekujące</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PanelLayout>
    </>
  );
}
