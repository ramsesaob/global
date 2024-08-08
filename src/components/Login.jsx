import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { createClient } from '@supabase/supabase-js';
import { carritoContext } from '../contexts/carritoContext';
import bcrypt from 'bcryptjs'; // Asegúrate de instalar bcryptjs
const SUPABASE_URL = 'https://psyauluoyjvrscijcafn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const Login = ({ show, handleClose }) => {

  const { setValidado, setDatosUsuario } = useContext(carritoContext);
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [datosCorrectos, setDatosCorrectos] = useState(false);

  // Reemplaza con tus credenciales de Supabase


  async function enviarDatos(event) {
    event.preventDefault();

    try {
        // Obtener usuarios de la tabla users
        const { data: users, error } = await supabase
            .from('users')
            .select('*');  // Ajusta esto según cómo almacenas las contraseñas

        if (error) {
            console.error('Error al obtener usuarios:', error.message);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al obtener datos de usuarios. Por favor, intente nuevamente.",
            });
            return;
        }

        // Encontrar al usuario correspondiente
        const user = users.find(u => u.username === usuario);

        if (user && bcrypt.compareSync(contrasenia, user.password)) {
            // Autenticación exitosa
            console.log('Usuario autenticado:', user);
            setDatosCorrectos(true);
            setValidado(true);
            setDatosUsuario(user);
            setUsuario(user);
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: "Inicio de sesión exitoso.",
            });
            handleClose();  // Cierra el modal después de autenticación exitosa
        } else {
            // Autenticación fallida
            setDatosCorrectos(false);
            setValidado(false);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Los datos ingresados no son correctos. Por favor, verifique.",
            });
        }
    } catch (err) {
        // Manejo de errores generales
        console.error('Error general:', err.message);
        setDatosCorrectos(false);
        setValidado(false);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ocurrió un error. Por favor, intente nuevamente.",
        });
    }
  }

  const nav = {
    background: '#000000',  /* fallback for old browsers */
    background: '-webkit-linear-gradient(to bottom, #0f9b0f, #000000)',  /* Chrome 10-25, Safari 5.1-6 */
    background: 'linear-gradient(to bottom, #0f9b0f, #000000)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  };

  return (
    <Modal show={show} onHide={handleClose} style={{ marginTop: '1%' }} size="sm" centered dialogClassName="modal-50w" className='text-white'>
      <Form onSubmit={enviarDatos} style={nav}>
        <Modal.Header closeButton>
          <Modal.Title className='text-center'>Inicio de Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Usuario</Form.Label>
            <div className="input-group flex-nowrap">
              <span className="input-group-text" id="addon-wrapping"><i className='bx bx-user'></i></span>
              <Form.Control
                autoComplete="on"
              //  type="email"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingresar usuario"
                aria-label="Username"
                aria-describedby="addon-wrapping"
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <div className="input-group flex-nowrap">
              <span className="input-group-text" id="addon-wrapping"><i className='bx bxs-key'></i></span>
              <Form.Control
                type="password"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                placeholder="Ingresar contraseña"
                aria-label="Password"
                aria-describedby="addon-wrapping"
              />
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" type='submit'>
            Enviar
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default Login;
