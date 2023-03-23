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
  faFloppyDisk,
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
import { toast } from 'react-toastify';
import StatusBadge from '@/components/Elements/StatusBadge';

export default function PanelMessages() {
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState({
    id: undefined,
    name: undefined,
    email: undefined,
    message: undefined,
    draftReply: undefined,
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
    if (messages?.length !== 0) {
      if (showMessages === 'closed') {
        setFilteredMessages(messages.filter((message) => message.status !== 'CLOSED'));
      } else {
        setFilteredMessages(messages);
      }

      if (router.query.id) {
        const id = parseInt(router.query.id as string, 10);
        const forceSelectedMessage = messages?.find((message) => message.id === id);
        if (forceSelectedMessage) {
          setSelectedMessage(forceSelectedMessage);
        }
      }
    }
  }, [messages, showMessages]);

  const updateStatus = async (id: number, status: string, notify = true) => {
    if (status === 'closed') setIsClosing(true);

    const response = await fetch('/api/contact/messages/updateStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        status,
      }),
    });

    const result = await response.json();
    if (status === 'closed') setIsClosing(false);

    if (result.error) {
      toast(result.error, { autoClose: 3000, type: 'error' });
    }

    if (notify) {
      if (!result.error) {
        toast(result.message, { autoClose: 3000, type: 'success' });
      }
    }
  };

  useEffect(() => {
    if (selectedMessage.id === undefined) return;

    router.push(`/panel/wiadomosci?id=${selectedMessage.id}`, undefined, { shallow: true });

    setDraftMessage(selectedMessage.draftReply || '');

    if (selectedMessage.status === 'PENDING') {
      updateStatus(selectedMessage.id, 'viewed', false);
    }
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

  const deleteMessage = async (id: number) => {
    // TODO: Add confirmation
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (!confirm('Czy na pewno chcesz usunąć tą wiadomość?')) return;

    setIsDeleting(true);
    const response = await fetch('/api/contact/messages/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    });

    const result = await response.json();

    setIsDeleting(false);
    if (result.error) {
      toast(result.error, { autoClose: 3000, type: 'error' });
    } else {
      toast(result.message, { autoClose: 3000, type: 'success' });
    }
  };

  const updateDraftMessage = async (id: number) => {
    setIsSaving(true);
    const response = await fetch('/api/contact/messages/updateDraft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        draftReply: draftMessage,
      }),
    });

    const result = await response.json();

    setIsSaving(false);
    if (result.error) {
      toast(result.error, { autoClose: 3000, type: 'error' });
    } else {
      toast(result.message, { autoClose: 3000, type: 'success' });
    }
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
              {filteredMessages?.length === 0 && (
                <div className="mx-auto pt-20 text-center">
                  <FontAwesomeIcon icon={faEnvelopeCircleCheck} size="2xl" className="w-12" />
                  <div className="mt-1 text-lg font-medium">Coś cicho, za cicho...</div>
                </div>
              )}
              {filteredMessages?.length !== 0 && (
                <div className="space-y-4">
                  {filteredMessages?.map((message) => (
                    <button
                      type="button"
                      key={message.id}
                      className={`block w-full rounded-lg bg-gray-100 p-4 text-left hover:bg-yellow-50 ${
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
                      <div className="mt-1 flex flex-row items-center space-x-2">
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
                        <StatusBadge status={selectedMessage.status} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-md bg-white p-4">
                    {selectedMessage.message.split('\n').map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <hr />
                    <div className="mt-2 mb-1 font-medium">Szkic odpowiedzi</div>
                    <textarea
                      name="draft_reply"
                      id="draft_reply"
                      rows={4}
                      cols={50}
                      disabled={selectedMessage.status === 'CLOSED'}
                      value={draftMessage}
                      onChange={(e) => setDraftMessage(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                      placeholder="Szkic Twojej odpowiedzi..."
                    ></textarea>
                  </div>
                  <div className="mt-4 flex flex-row items-center space-x-4">
                    {selectedMessage.status !== 'CLOSED' && (
                      <button
                        type="button"
                        disabled={isSaving}
                        className="flex flex-row items-center space-x-2 rounded-md border border-green-400 bg-green-400 px-3 py-2 text-sm"
                        onClick={() => updateDraftMessage(selectedMessage.id)}
                      >
                        <FontAwesomeIcon icon={faFloppyDisk} size="lg" className="w-5" />
                        <div>Zapisz szkic</div>
                      </button>
                    )}
                    {selectedMessage.status !== 'CLOSED' && (
                      <button
                        type="button"
                        disabled={isClosing}
                        className="flex flex-row items-center space-x-2 rounded-md border border-yellow-300 bg-yellow-300 px-3 py-2 text-sm"
                        onClick={() => updateStatus(selectedMessage.id, 'closed')}
                      >
                        <FontAwesomeIcon icon={faCheck} size="lg" className="w-5" />
                        <div>Oznacz jako zakończone</div>
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={isDeleting}
                      className="flex flex-row items-center space-x-2 rounded-md border border-red-500 px-3 py-2 text-sm text-red-500"
                      onClick={() => deleteMessage(selectedMessage.id)}
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
