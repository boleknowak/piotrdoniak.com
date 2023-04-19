import { CategoryInterface } from '@/interfaces/CategoryInterface';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

export default function ManageCategoriesModal({ isOpen, onClose, categories, setCategories }) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryInterface>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [isCreatingFormOpened, setIsCreatingFormOpened] = useState(false);
  const [openedCategoryIndex, setOpenedCategoryIndex] = useState<number>(-1);
  const cancelDeleteCategoryRef = useRef();
  const toast = useToast();
  const {
    isOpen: isDeleteCategoryDialogOpened,
    onOpen: openDeleteCategoryDialog,
    onClose: closeDeleteCategoryDialog,
  } = useDisclosure();

  const createCategory = async (e) => {
    e.preventDefault();
    setIsCreatingCategory(true);

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: e.target.category_name.value,
        slug: e.target.category_slug.value,
        position: e.target.category_position.value,
      }),
    });

    const data = await response.json();

    setIsCreatingCategory(false);
    toast({
      title: data.message,
      description: data.error_message || null,
      status: data.success ? 'success' : 'error',
      duration: data.success ? 3000 : 9000,
      isClosable: true,
    });

    if (data.success) {
      setCategories((prev) => [...prev, data.category]);
      e.target.reset();
      setIsCreatingFormOpened(false);
    }
  };

  const updateCategory = async (e, category: CategoryInterface) => {
    e.preventDefault();
    setIsUpdatingCategory(true);

    const response = await fetch(`/api/categories/${category.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: e.target.category_name.value,
        slug: e.target.category_slug.value,
        position: e.target.category_position.value,
      }),
    });

    const data = await response.json();

    setIsUpdatingCategory(false);
    toast({
      title: data.message,
      description: data.error_message || null,
      status: data.success ? 'success' : 'error',
      duration: data.success ? 3000 : 9000,
      isClosable: true,
    });

    if (data.success) {
      setCategories((prev) =>
        prev.map((item) => {
          if (item.id === category.id) {
            return data.category;
          }
          return item;
        })
      );
      setOpenedCategoryIndex(-1);
    }
  };

  const deleteCategory = async (category: CategoryInterface) => {
    setIsDeletingCategory(true);

    const response = await fetch(`/api/categories/${category.id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    setIsDeletingCategory(false);
    toast({
      title: data.message,
      description: data.error_message || null,
      status: data.success ? 'success' : 'error',
      duration: data.success ? 3000 : 9000,
      isClosable: true,
    });

    if (data.success) {
      setCategories((prev) => prev.filter((item) => item.id !== category.id));
      closeDeleteCategoryDialog();
    }
  };

  const updateField = (e, category: CategoryInterface, name: string) => {
    const { value } = e.target;

    setCategories((prev) =>
      prev.map((item) => {
        if (item.id === category.id) {
          return {
            ...item,
            [name]: value,
          };
        }
        return item;
      })
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Zarządzaj kategoriami</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Accordion allowToggle index={isCreatingFormOpened ? 0 : -1}>
              <AccordionItem>
                <h2>
                  <AccordionButton
                    onClick={() => {
                      setIsCreatingFormOpened(!isCreatingFormOpened);
                      setOpenedCategoryIndex(-1);
                    }}
                  >
                    <Box as="span" flex="1" textAlign="left">
                      Nowa kategoria
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <form onSubmit={createCategory}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Nazwa</FormLabel>
                        <Input
                          type="text"
                          name="category_name"
                          id="category_name"
                          placeholder="np. Programowanie"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Pozycja</FormLabel>
                        <Input
                          type="text"
                          name="category_position"
                          id="category_position"
                          placeholder="np. 1"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Uproszczona nazwa</FormLabel>
                        <Input
                          type="text"
                          name="category_slug"
                          id="category_slug"
                          placeholder="np. programowanie"
                        />
                        <FormHelperText fontSize="xs">
                          Slug kategorii, pole opcjonalne.
                        </FormHelperText>
                      </FormControl>
                      <Flex as="div" w="full" justifyContent="flex-end" pb={2}>
                        <Button type="submit" colorScheme="yellow" isLoading={isCreatingCategory}>
                          Stwórz
                        </Button>
                      </Flex>
                    </VStack>
                  </form>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Box fontWeight="bold" fontSize="sm" mt={4} mb={2}>
              {categories.length} {categories.length === 1 && 'kategoria'}
              {categories.length >= 2 && categories.length <= 4 && 'kategorie'}
              {(categories.length >= 5 || categories.length === 0) && 'kategorii'}
            </Box>
            <Accordion allowToggle pb={6} index={openedCategoryIndex}>
              {categories.map((category, key) => (
                <AccordionItem key={key}>
                  <h2>
                    <AccordionButton
                      onClick={() => {
                        setIsCreatingFormOpened(false);
                        setOpenedCategoryIndex(openedCategoryIndex === key ? -1 : key);
                      }}
                    >
                      <Box as="span" flex="1" textAlign="left">
                        {category.name}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <form onSubmit={(e) => updateCategory(e, category)}>
                      <VStack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>Nazwa</FormLabel>
                          <Input
                            type="text"
                            name="category_name"
                            placeholder={category.name}
                            value={category.name}
                            onChange={(e) => updateField(e, category, 'name')}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Pozycja</FormLabel>
                          <Input
                            type="text"
                            name="category_position"
                            placeholder={`${category.position}`}
                            value={category.position}
                            onChange={(e) => updateField(e, category, 'position')}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Uproszczona nazwa</FormLabel>
                          <Input
                            type="text"
                            name="category_slug"
                            placeholder={category.slug}
                            value={category.slug}
                            onChange={(e) => updateField(e, category, 'slug')}
                          />
                          <FormHelperText fontSize="xs">
                            Slug kategorii, pole opcjonalne.
                          </FormHelperText>
                        </FormControl>
                        <Flex as="div" w="full" justifyContent="flex-end" pb={2}>
                          <HStack spacing={4}>
                            <Button
                              type="button"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => {
                                setSelectedCategory(category);
                                openDeleteCategoryDialog();
                              }}
                              isLoading={isDeletingCategory}
                            >
                              Usuń
                            </Button>
                            <Button
                              type="submit"
                              colorScheme="yellow"
                              isLoading={isUpdatingCategory}
                            >
                              Zapisz
                            </Button>
                          </HStack>
                        </Flex>
                      </VStack>
                    </form>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </ModalBody>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isDeleteCategoryDialogOpened}
        leastDestructiveRef={cancelDeleteCategoryRef}
        onClose={closeDeleteCategoryDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Usuń kategorię "{selectedCategory?.name}"
            </AlertDialogHeader>
            <AlertDialogBody>
              Czy na pewno chcesz usunąć tę kategorię? Tej operacji nie można cofnąć.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelDeleteCategoryRef} onClick={closeDeleteCategoryDialog}>
                Anuluj
              </Button>
              <Button
                colorScheme="red"
                isLoading={isDeletingCategory}
                onClick={() => deleteCategory(selectedCategory)}
                ml={3}
              >
                Usuń
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
