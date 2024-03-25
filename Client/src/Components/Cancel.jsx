import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
import './Cancel.css';

const Cancel = () => {

  useEffect(() => {
    toast.error("Transaction Cancelled");
  }, []);

  return (
    <>
    <div className="dotted-bg">
      <ToastContainer limit={1} />
      <div className="cancel-container">
      <h1>Transaction Cancelled</h1>

      <svg width="80px" height="80px" viewBox="0 0 1024 1024" fill="#ff0000" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M332 663.2c-9.6 9.6-9.6 25.6 0 35.2s25.6 9.6 35.2 0l349.6-356c9.6-9.6 9.6-25.6 0-35.2s-25.6-9.6-35.2 0L332 663.2z" fill=""></path><path d="M681.6 698.4c9.6 9.6 25.6 9.6 35.2 0s9.6-25.6 0-35.2L367.2 307.2c-9.6-9.6-25.6-9.6-35.2 0s-9.6 25.6 0 35.2l349.6 356z" fill=""></path><path d="M516.8 1014.4c-277.6 0-503.2-225.6-503.2-503.2S239.2 7.2 516.8 7.2s503.2 225.6 503.2 503.2-225.6 504-503.2 504z m0-959.2c-251.2 0-455.2 204.8-455.2 456s204 455.2 455.2 455.2 455.2-204 455.2-455.2-204-456-455.2-456z" fill=""></path></g></svg>

      <p>Transaction failed or was Cancelled.</p>
      <Link to="/"><button id="cancel-btn" className="btn btn-outline-danger">Go Back To Home</button></Link>
    </div>
    </div>
    </>
  );
};

export default Cancel;

