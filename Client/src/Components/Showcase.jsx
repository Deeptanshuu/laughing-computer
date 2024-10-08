import React, { useState } from "react";
import { GlassMagnifier } from "react-image-magnifiers";
import { LazyLoadImage } from "react-lazy-load-image-component";
import QuantitySelector from "./QuatitySelector";
import { useCart } from "./CartContext";
import { Link, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-toastify";
import {
  EmailShareButton,
  PinterestShareButton,
  TumblrShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  EmailIcon,
  PinterestIcon,
  TumblrIcon,
  WhatsappIcon,
  XIcon,
} from "react-share";
import itemsData from "./items.json";
import "./Showcase.css";

const Showcase = () => {
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");


  const allItems = Object.values(itemsData).flatMap((category) => category);
  const selectedItem = allItems.find((item) => item.id === id);

  const [mainImg, setMainImg] = useState(selectedItem.img);

  
  const shareUrl = `https://tsukimarket.vercel.app/shop/product/showcase?id=${selectedItem.id}`;
  const title = 'Hey! Check out my Mini Project\n';

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link Copied Successfully");
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleImageClick = (imgSrc) => {
    window.scrollTo(0, 320);
    setMainImg(imgSrc);
  };

  function handleAddToCart() {
    if (size === null) {
      toast.error("Please select a size", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        transition: Slide,
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    else {
      const addedItem = {
        id: selectedItem.id +" "+ size,
        name: selectedItem.name,
        img: selectedItem.img,
        price: selectedItem.price,
        inStock: selectedItem.inStock,
        category: selectedItem.category,
        ref: selectedItem.id
      }
      addToCart(addedItem, quantity, size);
      toast.success("Item added to your cart!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        transition: Slide,
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    }
  }

  if (!selectedItem) {
    return <div>Item not found!</div>;
  }

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  //console.log(selectedItem);

  return (
    <div>
      <ToastContainer />
      <div className="header-showcase">
        <h1>- Item details -</h1>
      </div>

      <div className="showcase-wrapper" key={selectedItem.id}>
        <div className="showcase-img">
          <div className="showcase-img-list-icons">
            {["img2", "img3", "img4"].map((imgKey) => (
              <div className="img-list" key={imgKey}>
                <button
                  className="img-list-button"
                  onClick={() => handleImageClick(selectedItem[imgKey])}
                >
                  <img
                    src={selectedItem[imgKey]}
                    alt={`showcase-img-${imgKey}`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="magnify-image-container">
            <div className="magnify-image">
              <GlassMagnifier
                imageSrc={mainImg}
                imageAlt="showcase-img"
                magnifierSize="60%"
                magnifierBorderColor="rgba(0, 0, 0)"
                magnifierBorderSize="1"
              />
            </div>
            <p>
              made with love, <br></br>from tsuki ❤️
            </p>
          </div>
        </div>

        <div className="showcase-text">
          <div className="showcase-text-name">
            <h2>{selectedItem.name}</h2>
          </div>

          <div className="showcase-text-price">
            <h4>₹{selectedItem.price}/-</h4>
          </div>

          <div className="showcase-text-stock">
            <h6>Selected Size: {size}</h6>
          </div>

          <div class="dropdown" style={{cursor: selectedItem.inStock ? "pointer" : "not-allowed"}}>
            <button
              className={`btn btn-outline-dark dropdown-toggle z-0 ${selectedItem.inStock ? "" : "disabled"}`}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {size===null ? "Select Size" : `${size}`}
            </button>
            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" onClick={() => setSize("XS")} >Xtra Small -XS-</button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => setSize("S")} >Small -S-</button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => setSize("M")} >Medium -M-</button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => setSize("L")} >Large -L-</button>
              </li>
              <li>
                <button class="dropdown-item" onClick={() => setSize("XL")} >Xtra Large -XL-</button>
              </li>
            </ul>
          </div>

          <div className="quantity-box-text">
          <h6>Quantity:</h6>{/* dont put this in div container*/}
          </div>
          
          <div className="quantity-box-container">
            <QuantitySelector
              quantity={quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              state={selectedItem.inStock}
            />
          </div>


          <div className="showcase-text-stock">
            <h6>{selectedItem.inStock ? "In Stock ✅" : "Out of Stock ❌"}</h6>
          </div>

          <div className="add-cart" style={{ cursor: selectedItem.inStock ? "pointer" : "not-allowed" }}>
            <button
              className={`btn btn-outline-dark  ${
                selectedItem.inStock ? "" : "disabled"
              }`}
              onClick={() => handleAddToCart()}
            >
              Add to Cart
            </button>
          </div>

          <div className="showcase-text-desc">
            <p>{selectedItem.description}</p>
          </div>

          <div className="details">
            <u>DETAILS:</u>
            <p>•Embroidery details on front and back, 100% cotton.</p>
            <p>
              •<b>Care Instructions:</b> Hand wash with soap and water, air dry,
              do not put in washer/dryer.
            </p>
            <p>•80% acrylic, 20% nylon; made with extra fluffy yarn.</p>
            <p>
              •Wash at 30 degrees celsius, cool iron, dry flat, do not bleach or
              dry clean.
            </p>
            <p>
              •Made in the UK as a fully fashioned flat knit, producing a nearly
              waste free product.
            </p>
          </div>
          <div className="share-details">
            <h1>SHARE </h1>
            <div className="share-icons">
            <TwitterShareButton
            url={shareUrl}
            title={title}
            className="Demo__some-network__share-button"
            >
              <XIcon size={54} round={false} />
            </TwitterShareButton>

            <WhatsappShareButton
          url={shareUrl}
          title={title}
          separator=":: "
          className="Demo__some-network__share-button"
        >
          <WhatsappIcon size={50} round={false} />
        </WhatsappShareButton>

        <PinterestShareButton
          url={String(window.location)}
          media={`https://tsukimarket.vercel.app/shop/basic-2.png`}
          className="Demo__some-network__share-button"
        >
          <PinterestIcon size={54} round={false} />
        </PinterestShareButton>

        <TumblrShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button"
        >
          <TumblrIcon size={54} round={false} />
        </TumblrShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={title}
          body="body"
          className="Demo__some-network__share-button"
        >
          <EmailIcon size={54} round={false}  />
        </EmailShareButton>

        <button className="btn btn-outline border-0" onClick={handleCopy} id={copied}>
          <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z" fill="#0F0F0F"/>
          <path d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z" fill="#0F0F0F"/>
          </svg>
        </button>

        </div>

          </div>
        </div>
      </div>

      

      <div className="more-items-cover">
          <div className="more-items-text">
            <h4>- Explore similar items -</h4>
          </div>
          <div className="more-items">
            {allItems
              .sort(() => Math.random() - 0.5)
              .slice(0, 5)
              .map((item) => (
                <div className="product-card" id={item.id}>
                  <Link
                    to={`/shop/product/showcase?id=${item.id}`}
                    onClick={() => handleImageClick(item.img)}
                    className="view-item-button"
                  >
                    <div
                      className="product-status-chip"
                      style={{opacity: item.inStock ? 0 : 1, }}>
                      <h6>SOLD OUT</h6>
                    </div>

                    <div className="product-card-image">
                      <Link
                        to={`/shop/product/showcase?id=${item.id}`}
                        onClick={() => handleImageClick(item.img)}
                      >
                        <LazyLoadImage
                          effect="blur"
                          src={item.img}
                          alt="product-card-view"
                        />
                      </Link>
                    </div>

                    <div className="quick-view">
                      <h1>QUICK VIEW</h1>
                    </div>
                    <div className="product-card-text">
                      <h3>{item.name}</h3>
                      <Link
                        to={`/shop/product/showcase?id=${item.id}`}
                        onClick={() => handleImageClick(item.img)}
                        className="view-item-button"
                      >
                        - View Item -
                      </Link>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>

        <div className="footer-showcase">
          <Link
            to={`/shop/product?category=${selectedItem.category}`}
            className="back-to-collection-button"
          >
            <p>- Back to Collection -</p>
          </Link>
        </div>
    </div>
  );
};

export default Showcase;
