import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
import { UserInterface } from '@/interfaces/UserInterface';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faClock, faEye, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faLeftLong,
  faClock as faClockSolid,
  faEnvelope,
  faEnvelopeCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/Elements/Badge';
import { useRouter } from 'next/router';
import StatusBadge from '@/components/Elements/StatusBadge';
import Avatar from '@/components/Elements/Avatar';
import DateComponent from '@/components/Date';
import { Button, FormControl, FormLabel, Icon, Textarea, useToast } from '@chakra-ui/react';
import { BiCheck, BiSave } from 'react-icons/bi';

export default function PanelMessages() {
  const [contacts, setContacts] = useState([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedContact, setSelectedContact] = useState({
    id: undefined,
    name: undefined,
    email: undefined,
    avatar: undefined,
    draftReply: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    messages: [],
    lastMessageCreatedAt: undefined,
  });
  const { data: session, status: authed } = useSession();
  const router = useRouter();
  const toast = useToast();

  const fetchData = async () => {
    const response = await fetch('/api/contact/messages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (result.error) {
      toast({
        title: 'Wystąpił błąd',
        description: result.error || 'Nie udało się pobrać wiadomości',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setContacts(result.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (contacts.length !== 0) {
      setFilteredContacts(contacts);

      if (router.query.id) {
        const id = parseInt(router.query.id as string, 10);
        const forceSelectedContact = contacts?.find((contact) => contact.id === id);
        if (forceSelectedContact) {
          setSelectedContact(forceSelectedContact);
        }
      }
    }
  }, [contacts]);

  const updateStatus = async (ids: Array<number>, status: string, notify = true) => {
    if (status === 'closed') {
      setIsClosing(true);
    }

    const response = await fetch('/api/contact/messages/updateStatusBulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids,
        status,
      }),
    });

    const result = await response.json();
    if (status === 'closed') {
      setIsClosing(false);
    }

    if (result.error) {
      toast({
        title: 'Wystąpił błąd',
        description: result.error || 'Nie udało się zaktualizować statusu wiadomości',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    if (notify && !result.error) {
      toast({
        title: 'Sukces',
        description: 'Status wiadomości został zaktualizowany',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }

    fetchData();
  };

  useEffect(() => {
    if (selectedContact.id === undefined) return;

    router.push(`/panel/wiadomosci?id=${selectedContact.id}`, undefined, { shallow: true });

    setDraftMessage(selectedContact.draftReply || '');

    const selectedMessage = selectedContact.messages.filter(
      (message) => message.status === 'PENDING'
    );
    if (selectedMessage.length > 0) {
      updateStatus(
        selectedMessage.map((m) => m.id),
        'viewed',
        false
      );
    }
  }, [selectedContact]);

  if (authed === 'loading') return <LoadingPage />;
  const user = session?.user as UserInterface;

  const formatName = (name: string) => {
    const nameArray = name.split(' ');

    if (nameArray.length === 1) return nameArray[0];

    const firstName = nameArray[0];
    const lastName = nameArray[1];

    return `${firstName} ${lastName.charAt(0)}.`;
  };

  const updateDraftReply = async (id: number) => {
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

    toast({
      title: result.error ? 'Wystąpił błąd' : 'Sukces',
      description: result.error || result.message,
      status: result.error ? 'error' : 'success',
      duration: 5000,
      isClosable: true,
    });

    fetchData();
  };

  const hasUnreadMessages = (contact) => {
    const unreadMessages = contact.messages.filter((message) => message.status === 'PENDING');
    return unreadMessages.length > 0;
  };

  const hasViewedMessages = (contact) => {
    const viewedMessages = contact.messages.filter((message) => message.status === 'VIEWED');
    return viewedMessages.length > 0;
  };

  const displayIcon = (contact) => {
    if (hasViewedMessages(contact)) {
      return <FontAwesomeIcon icon={faEye} size="lg" className="w-5 text-blue-600" />;
    }

    if (hasUnreadMessages(contact)) {
      return <FontAwesomeIcon icon={faClock} size="lg" className="w-5 text-yellow-600" />;
    }

    return null;
  };

  const displayStatus = (contact) => {
    if (contact.draftReply) return 'DRAFT';
    if (hasViewedMessages(contact)) return 'VIEWED';
    if (hasUnreadMessages(contact)) return 'PENDING';
    return 'CLOSED';
  };

  const messagesCount = () => {
    if (filteredContacts) {
      return filteredContacts.reduce((acc, contact) => acc + contact.messages.length, 0);
    }
    return 0;
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
                Masz {messagesCount()} {messagesCount() !== 1 && <span>wiadomości</span>}
                {messagesCount() === 1 && <span>wiadomość</span>}
              </h1>
              <div>Kto do Ciebie napisał, {user?.firstName}? 😮</div>
            </div>
            <div>
              {/* TODO: add filters, request for filtered options, so I dont need localStorage */}
              {/* <button
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
              </button> */}
            </div>
          </div>
        </div>
        <div>
          <div className="flex w-full flex-grow flex-row space-x-4">
            <div className="contact-height w-96 space-y-2">
              <div className="font-bold uppercase">Lista</div>
              {filteredContacts.length === 0 && (
                <div className="mx-auto pt-20 text-center">
                  <FontAwesomeIcon icon={faEnvelopeCircleCheck} size="2xl" className="w-12" />
                  <div className="mt-1 text-lg font-medium">Coś cicho, za cicho...</div>
                </div>
              )}
              {filteredContacts.length !== 0 && (
                <div className="space-y-2">
                  {filteredContacts.map((contact) => (
                    <button
                      type="button"
                      key={contact.id}
                      className={`block w-full rounded-lg bg-gray-100 p-4 text-left hover:bg-yellow-50 ${
                        selectedContact.id === contact.id && '!bg-yellow-50'
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center space-x-4">
                          <div className="relative">
                            <Avatar
                              src={contact.avatar || undefined}
                              alt={contact.name}
                              size={40}
                              className="rounded-full"
                            />
                            <div className="flex-center absolute bottom-0 right-0 -mr-1 h-4 w-4 rounded-full bg-yellow-500 text-xs font-medium text-black">
                              {contact.messages.length}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{formatName(contact.name)}</div>
                            <div className="text-xs text-gray-500">
                              <DateComponent dateString={contact.lastMessageCreatedAt} />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                          {contact.draftReply && (
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              size="lg"
                              className="w-5 text-purple-600"
                            />
                          )}
                          {displayIcon(contact)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full rounded-md bg-gray-100 p-4">
              {selectedContact.id === undefined && (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="mx-auto text-center">
                    <FontAwesomeIcon icon={faLeftLong} size="4x" className="w-12" />
                    <div className="text-lg font-medium">Wybierz wiadomość</div>
                  </div>
                </div>
              )}
              {selectedContact.id !== undefined && (
                <div>
                  <div className="flex flex-row items-center space-x-4">
                    <Avatar
                      src={selectedContact.avatar || undefined}
                      alt={selectedContact.name}
                      size={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-bold">{selectedContact.name}</div>
                      <div className="mt-1 flex flex-row items-center space-x-2">
                        <Badge
                          variant="outlined-gray"
                          additionalClasses="flex flex-row items-center space-x-1"
                        >
                          <FontAwesomeIcon icon={faClockSolid} size="sm" className="-ml-1 w-3" />
                          <DateComponent dateString={selectedContact.createdAt} />
                        </Badge>
                        <Badge
                          variant="outlined-gray"
                          additionalClasses="flex flex-row items-center space-x-1"
                        >
                          <FontAwesomeIcon icon={faEnvelope} size="sm" className="-ml-1 w-3" />
                          <div>{selectedContact.email}</div>
                        </Badge>
                        <StatusBadge status={displayStatus(selectedContact)} />
                      </div>
                    </div>
                  </div>
                  {selectedContact.messages.length !== 0 && (
                    <div className="mt-4 space-y-2">
                      {selectedContact.messages.map((message) => (
                        <div key={message.id} className="mt-4 rounded-md bg-white p-4">
                          <div className="mb-1 flex flex-row items-center space-x-2 text-xs text-gray-500">
                            <DateComponent dateString={message.createdAt} withTime={true} />
                            <div>•</div>
                            <button
                              type="button"
                              className="block hover:text-green-600"
                              onClick={() => updateStatus([message.id], 'closed')}
                            >
                              <FontAwesomeIcon icon={faCheckSquare} size="sm" className="w-3" />
                            </button>
                          </div>
                          {message.message.split('\n').map((line: string) => (
                            <div key={line}>{line}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4">
                    <hr />
                    <FormControl id="reply" className="mt-2">
                      <FormLabel>Szkic odpowiedzi</FormLabel>
                      <Textarea
                        name="draft_reply"
                        id="draft_reply"
                        rows={4}
                        cols={50}
                        value={draftMessage}
                        onChange={(e) => setDraftMessage(e.target.value)}
                        placeholder="Szkic Twojej odpowiedzi..."
                        bgColor="white"
                      ></Textarea>
                    </FormControl>
                  </div>
                  <div className="mt-4 flex flex-row items-center space-x-4">
                    <Button
                      colorScheme="green"
                      isLoading={isSaving}
                      leftIcon={<Icon as={BiSave} />}
                      onClick={() => updateDraftReply(selectedContact.id)}
                    >
                      Zapisz szkic
                    </Button>
                    {(hasUnreadMessages(selectedContact) || hasViewedMessages(selectedContact)) && (
                      <Button
                        colorScheme="yellow"
                        isLoading={isClosing}
                        leftIcon={<Icon as={BiCheck} />}
                        onClick={() =>
                          updateStatus(
                            selectedContact.messages.map((c) => c.id),
                            'closed'
                          )
                        }
                      >
                        Oznacz jako przeczytane
                      </Button>
                    )}
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
