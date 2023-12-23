import PerfectScrollbar from 'react-perfect-scrollbar';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import axios from 'axios';
import getApiUrl from '../../../config';

interface NavigatorWithContacts extends Navigator {
    contacts?: any; // Puedes ajustar el tipo según la estructura de 'contacts'
}

interface Note {
    id: number;
    user: string;
    thumb: string;
    title: string;
    description: string;
    date: string;
    isFav: boolean;
    tag: string;
}

const Notes = () => {
    const dispatch = useDispatch();
    const [notesList, setNoteList] = useState<Note[]>([]); // Ajustar el tipo a Note[]
    const [isContactAuthorized, setIsContactAuthorized] = useState(false);

    useEffect(() => {
        dispatch(setPageTitle('Contacto'));
    }, [dispatch]);

    const apiURL = getApiUrl();

    const requestContacts = async () => {
        const storedUsdDate = localStorage.getItem('userData');
        const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

        try {
            // Verificar si 'contacts' está presente en el objeto Navigator
            if ('contacts' in navigator) {
                const navigatorWithContacts = navigator as NavigatorWithContacts;
                // Solicitar permisos para acceder a los contactos
                const contacts = await navigatorWithContacts.contacts.select(['*'], { multiple: true });
                setNoteList(contacts);
                // Guardar los contactos en localStorage

                const response = await axios.post(`${apiURL}/api/contacto`, {
                    userDocumento: userDocumento,
                    contactos: contacts,
                });

                localStorage.setItem('contacts', JSON.stringify(contacts));
                setIsContactAuthorized(true);
            } else {
                console.warn('La API de Contactos no está disponible en este navegador.');
            }
        } catch (error) {
            console.error('Error al obtener los contactos:', error);
            setIsContactAuthorized(false);
        }
    };

    useEffect(() => {
        // Si aún no se han autorizado los contactos, solicitar permisos
        if (!isContactAuthorized) {
            requestContacts();
        }
    }, [isContactAuthorized]);

    return (
        <div>
            <PerfectScrollbar>
                {/* Renderizar la lista de notas o contactos */}
                {notesList.map((note) => (
                    <div key={note.id}>
                        <p>{note.title}</p>
                        {/* Agrega más información de la nota o contacto según sea necesario */}
                    </div>
                ))}
            </PerfectScrollbar>
        </div>
    );
};

export default Notes;
