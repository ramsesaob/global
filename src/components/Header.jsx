import { Link } from "react-router-dom";
import React from 'react';

import { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
import logo from '../assets/logo.png'
import logo2 from '../assets/logo2.png'
import Login from "./Login";

// para el contexto
import { useContext } from "react";
import { carritoContext } from "../contexts/carritoContext";





const Header = () => {
  // controla los detalles
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    
    const nav = {
      background: '#000000',  /* fallback for old browsers */
      background: '-webkit-linear-gradient(to bottom, #0f9b0f, #000000)',  /* Chrome 10-25, Safari 5.1-6 */
      background: 'linear-gradient(to bottom, #0f9b0f, #000000)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

    
    };
    
     // para el buscador
    const [inputValue, setInputValue] = useState('');
    const handleChange = (event) => {
      setInputValue(event.target.value);
    };


    const navigate = useNavigate();
    const handleSubmit = (event) => {
      event.preventDefault();
      navigate('/busquedas', {
        state: inputValue,
      });	
    };

    const { cart, vaciar, comprar, validado, datosUsuario, salir } = useContext(carritoContext)
    const total = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const totalCantidad = cart.reduce((total, item) => total + item.cantidad, 0);
    const totalPrecio = cart.reduce((total, item) => total + item.cantidad * item.price, 0);
    
  return (
    <>
  
    <nav className="navbar navbar-expand-lg p-2 " data-bs-theme="dark"  style={nav}>
    <div className="container-fluid">
    <a className="navbar-brand" href="#"><img src={logo} alt="logo" width={30} className="rounded"/></a>
        <a className="navbar-brand" href="#"></a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
        {
          validado ?
          <>
             {datosUsuario.role == "admin" && (
        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
 
           
              <li className="nav-item">
                  <Link to="/Inicio" className="nav-link active" aria-current="page" href="#"> <i className='bx bx-home' ></i>Inicio</Link>
              </li>
             
              <li className="nav-item dropdown">
                            <a className="nav-link active" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className='bx bx-list-ul'></i> Solicitud
                            </a>
                            <ul className="dropdown-menu">
                              <li><Link to="/Formulario" className="nav-link active" aria-current="page" href="#"> Solicitud </Link></li>
                              <li><Link to="/Formulario2" className="nav-link active" aria-current="page" href="#">Solicitud Navidad</Link></li>
                            
                            </ul>
                          </li>
             
              <li className="nav-item">
                    <Link to="/IndexPage" className="nav-link active" aria-current="page" href="#"><i className='bx bxs-archive'></i>Ver Ordenes</Link>
              </li>
 
        </ul>
         )}

         
                {datosUsuario.role == "user1" && (
                  <ul className="navbar-nav mx-auto mb-2 mb-lg-0" >
          
                    
                        <li className="nav-item">
                            <Link to="/Inicio" className="nav-link active" aria-current="page" href="#"> <i className='bx bx-home' ></i>Inicio</Link>
                        </li>
                      
                        <li className="nav-item dropdown">
                            <a className="nav-link active" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className='bx bx-list-ul'></i> Solicitud
                            </a>
                            <ul className="dropdown-menu">
                              <li><Link to="/Formulario" className="nav-link active" aria-current="page" href="#"> Solicitud </Link></li>
                              <li><Link to="/Formulario2" className="nav-link active" aria-current="page" href="#">Solicitud Navidad</Link></li>
                            
                            </ul>
                          </li>

                      
                        <li className="nav-item">
                              <Link to="/IndexPage" className="nav-link active" aria-current="page" href="#"><i className='bx bxs-archive'></i> Mis Ordenes</Link>
                        </li>
          
                  </ul>
                  )}    

              {datosUsuario.role == "user2" && (
                  <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
          
                    
                        <li className="nav-item">
                            <Link to="/Inicio" className="nav-link active" aria-current="page" href="#"> <i className='bx bx-home' ></i>Inicio</Link>
                        </li>
                      
                       
                      
                        <li className="nav-item">
                              <Link to="/IndexPage" className="nav-link active" aria-current="page" href="#"><i className='bx bxs-archive'></i> Ver Ordenes</Link>
                        </li>
          
                  </ul>
                  )}
        <ul className="navbar-nav ml-auto "  data-bs-theme="dark">
        <li className="nav-item dropdown text-white" data-bs-theme="dark">
          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          
          <span className="mx-2 text-dark fw-bold text-white">{`${datosUsuario.nombre} `}</span>
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="#"> Ver mi Perfil</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item " href="#" onClick={() => salir()}><button className="btn btn-danger d-flex align-items-center">  Cerrar Sesión <i className='bx bx-log-out bx-sm ms-1'></i>  </button>  </a></li>
          </ul>
        </li>
      </ul>
      </>
                    :  <a className="btn btn-light btn-lg btn-outline-dark text-center" href="#" onClick={handleShow}><i className='bx bx-user '></i> Login</a>
                   
                }
       
        </div>
    </div>
    </nav>



<Login show={show} handleClose={handleClose}  />
</>
  )
  
}

export default Header
