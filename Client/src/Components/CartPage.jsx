// CartPage.jsx
import React from "react";
import { useCart } from "./CartContext";
import "./CartPage.css";
import { Link, useNavigate } from "react-router-dom";
import QuantitySelector from "./QuatitySelector";
import { ToastContainer, toast } from "react-toastify";
import {loadStripe} from '@stripe/stripe-js';
import { decodeToken, isExpired } from "react-jwt";

const CartPage = () => {
  const {
    addToCartpage,
    subFromCartpage,
    cart,
    removeFromCart,
    calculateTotalWithTaxAndShipping,
    calculateTax,
    calculateShipping,
    calculateTotal,
  } = useCart();

  const navigate = useNavigate();

  const handleIncrement = (item) => {
    //console.log(item)
    if (item.quantity < 10) {
    addToCartpage(item, item.size)
    }
  };


  const handleDecrement = (item) => {
    //console.log(item)
    if (item.quantity > 1) {
      subFromCartpage(item, item.size)
    }
  };

  const makePayment = async () => {
    const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    const token = localStorage.getItem("token");
    const decoded = decodeToken(token);

    if(decoded.phone === undefined || decoded.address === undefined || isExpired(token)) {
      setTimeout(() => {
        navigate("/user?update_profile");
      }, 0);
      return null;
    }
    
    const body = {
      token: localStorage.getItem("token"),
      cart: localStorage.getItem("cart")
    }

    const header ={
      "Content-Type":"application/json",
    }

    const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/db/payment`, {
      method: "POST",  
      headers: header,
      body: JSON.stringify(body),
    })

    const Session = await response.json();
    const stripe = await stripePromise;
    
    const result = await stripe.redirectToCheckout({
      sessionId: Session.id
    });
    
    if (result.error) {
      console.log(result.error.message);
      toast.error(result.error.message);
    }
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first!");
      setTimeout(() => {
        navigate("/login");
      },800);
      return null;
    }
    makePayment();
  };

  return (
    <>
    <ToastContainer/>
      <div className="cart-header">
        <h1>-Your Cart-</h1>
      </div>

      {cart.length === 0 ? (
        <div className="dotted-bg">
          <div className="empty-cart-message fw-bold p-5 text-center">
            <p>Nothing in your cart....yet.🛒</p>
          </div>
        </div>
      ) : (
        <div className="cart-wrapper">
          <div className="cart-list">
            <div className="cart-item-header">- Cart Items -</div>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-pic">
                  <Link to={`/shop/product/showcase?id=${item.ref}`}>
                    <img
                      src= {item.img}
                      class="img-fluid"
                      alt="cart item pic"
                    />
                  </Link>
                  
                </div>
                <div className="cart-item-details" style={{ display: "flex", flexDirection: "column" }}>
                  <ul>{item.name} </ul>
                  <ul><p>Size: {item.size}</p></ul>
                </div>

                <div className="cart-item-quantity">
                
                  <h5> | ₹{item.price} | </h5>
                  
                  <p>
                    <QuantitySelector
                      quantity={item.quantity}
                      onIncrement={() => handleIncrement(item)}
                      onDecrement={() => handleDecrement(item)}
                      state={true}
                    />
                  </p>
                  <button
                    className="btn btn-outline-danger btn-lg"
                    onClick={() => removeFromCart(item)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-price">
              {cart.length > 0 && (
                <>
                  <table>
                    <td>
                      <tr>
                        <h5><b>Subtotal :</b></h5>
                      </tr>

                      <tr>
                        <h5><b>Total Tax (10%) :</b></h5>
                      </tr>

                      <tr>
                        <h5><b>Total Shipping (₹100/item) :</b></h5>
                      </tr>

                      <tr>
                        <h5><b>Grand Total: </b></h5>
                      </tr>
                    </td>
                    <td>
                      <tr>
                        {" "}
                        <h5> ₹{calculateTotal()} </h5>{" "}
                      </tr>

                      <tr>
                        {" "}
                        <h5> ₹{calculateTax()} </h5>{" "}
                      </tr>

                      <tr>
                        {" "}
                        <h5> ₹{calculateShipping()} </h5>{" "}
                      </tr>

                      <tr>
                        {" "}
                        <h5> ₹{calculateTotalWithTaxAndShipping()} </h5>{" "}
                      </tr>
                    </td>
                  </table>
                  <button className="btn btn-outline-dark btn-lg" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className="footer p-5 text-xl-center fw-lighter"
        style={{ background: "#f4e0ea" }}
      >
        <Link to="/shop">
          <p style={{ color: "black" }}>- BACK TO COLLECTION -</p>
        </Link>
        <small style={{ color: "black" }}>
          -😊 HAPPY SHOPPING ハッピー・ショッピング 😊-
        </small>
      </div>
    </>
  );
};

export default CartPage;
