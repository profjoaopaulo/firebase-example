import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { db } from './firebase'; // Importa a instância configurada do Firestore do firebase.js
//Importa os objetos necessários para operar o CRUD dos documentos do Firestore
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

const App = () => {
    const [books, setBooks] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {

        //CRUD: Read; Listener em tempo real da base de dados
        const unsubscribe = onSnapshot(collection(db, "books"), (snapshot) => {
            const bookList = snapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
            }));
            setBooks(bookList);
        }, (error) => {
            console.error('Erro ao ouvir mudanças nos livros:', error);
        });
        return () => unsubscribe();
    }, []);

    //CRUD: Create
    const addBook = async () => {
        try {
            await addDoc(collection(db, "books"), {
                title: newTitle,
            });
            setNewTitle('');
        } catch (error) {
            console.error('Erro ao adicionar livro:', error);
        }
    };

    //CRUD: Update
    const updateBook = async () => {
        if (selectedBook) {
            try {
                const docRef = doc(db, "books", selectedBook.id);
                await updateDoc(docRef, { title: newTitle });

                setNewTitle('');
                setSelectedBook(null);
            } catch (error) {
                console.error('Erro ao atualizar livro:', error);
            }
        }
    };

    //CRUD: Delete
    const deleteBook = async (id) => {
        try {
            const docRef = doc(db, "books", id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Erro ao excluir livro:', error);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Livros</Text>
            <FlatList
                data={books}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.bookItem}>
                        <Text>{item.title}</Text>
                        <View style={styles.buttonContainer}>
                            <Button title="Editar" onPress={() => {
                                setNewTitle(item.title);
                                setSelectedBook(item);
                            }} />
                            <Button title="Excluir" onPress={() => deleteBook(item.id)} />
                        </View>
                    </View>
                )}
            />

            <TextInput
                style={styles.input}
                placeholder="Título do livro"
                value={newTitle}
                onChangeText={setNewTitle}
            />

            <View style={styles.buttonContainer}>
                <Button title={selectedBook ? "Atualizar Livro" : "Adicionar Livro"} onPress={selectedBook ? updateBook : addBook} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    bookItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default App;