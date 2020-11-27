import React, { Component, useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Cart } from "react-bootstrap-icons";
// import PayPal from "./components/Paypal";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [cartFetched, setCartFetched] = useState(false);
  const [cartProducts,setCartProducts] = useState([])

  const removeProduct = (productId) => {
    setCart((prevCart) => {
      const newProducts = prevCart.products.filter(
        (value) => value.productId !== productId
      );

      return {
        id: prevCart.id,
        userId: prevCart.userId,
        date: prevCart.date,
        products: newProducts,
      };
      //return prevCart
    });
  };

  const updateProductDetails = (price, quantity, productId) => {

        setCartProducts((prevDetails) => {
          const newDetails = []
          if (prevDetails.length !== 0){
            prevDetails.forEach((elm)=>{
              if(elm.productId === productId){
                newDetails.push({price,quantity,productId})
              }else{
                newDetails.push(elm)
              }
              return newDetails
            })           
          }       
          return [...prevDetails, {price,quantity,productId}]
        })
  }
  const updateProduct = (quantity, price, productId) => {
    updateProductDetails(quantity, price, productId);
    console.log(cartProducts)
    setCart(({id, userId, date, products}) => {
      const newProducts = [];
      products.forEach((product) => {
        if (product.productId === productId) {
          newProducts.push({ productId, quantity });
        } else {
          newProducts.push(product);
        }
      });

      return {
        id,
        userId,
        date,
        products: newProducts,
      };
    });
  };

  const updateCart = () => {
    const { id, userId, date, products } = cart;
    fetch(`https://fakestoreapi.com/carts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ userId, date, products }),
    })
      .then((res) => res.json())
      .then((cart) => setCart(cart));
  };

  const fetchCart = () => {
    fetch("https://fakestoreapi.com/carts/1")
      .then((res) => res.json())
      .then((cart) => {
        setCart(cart);
        setIsLoading(false);
        setCartFetched(true);
      });
  };

  useEffect(() => {
    if (cartFetched === false) {
      fetchCart();
    }
  }, [cartFetched]);

  return isLoading ? (
    <div className="container-loader">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  ) : (
    <div className="App">
      <div className="container px-4 py-5 mx-auto">
        <div className="row d-flex justify-content-center">
          <div className="col-5">
            <h4 className="heading">Shopping Bag</h4>
          </div>
          <div className="col-7">
            <div className="text-right row">
              <div className="col">
                <h6 className="mt-2">Category</h6>
              </div>
              <div className="col">
                <h6 className="mt-2">Quantity</h6>
              </div>
              <div className="col">
                <h6 className="mt-2">Price</h6>
              </div>
              <div className="col"></div>
            </div>
          </div>
        </div>

        {cart.products.map((product, key) => {
          return (
            <Products
              productId={product.productId}
              qty={product.quantity}
              updateQuantity={updateProduct}
              removeProduct={removeProduct}
              key={key}
            />
          );
        })}
        {cart.products.length === 0 && (
          // <div className="p-4">
          //   <h1 className="text-center">Cart Empty</h1>
          //   <span>
          //     <br />
          //   </span>
          //   <a href="/">Reload Page</a>
          // </div>

          <div class="container-fluid mt-100">
            <div class="row">
              <div class="col-md-12">
                <div class="card">
                  <div class="card-header">
                    
                  </div>
                  <div class="card-body cart">
                    <div class="col-sm-12 empty-cart-cls text-center">
                      {" "}
                      <img
                        src="https://i.imgur.com/dCdflKN.png"
                        width="130"
                        height="130"
                        class="img-fluid mb-4 mr-3"
                      />
                      <h3>
                        <strong>Your Cart is Empty</strong>
                      </h3>
                      <h4>Add something to make me happy :)</h4>{" "}
                      <a
                        href="/"
                        class="btn btn-primary cart-btn-transform m-3"
                        data-abc="true"
                      >
                        continue shopping
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="row justify-content-center">
          <Payments productDetails={cartProducts} />
        </div>
      </div>
    </div>
  );
};

const Payments = ({productDetails}) => {
    const [subTotal,setSubTotal] = useState(0)
    const shipping = 2.99;
    const tax = 10
  useEffect(()=>{
    console.log(productDetails)
  if(productDetails.length !== 0){
    const subTotal = productDetails.reduce((total,cur)=>{
      return (total.price*total.quantity)+(cur.price*cur.quantity)
    })
    setSubTotal(subTotal)
  }
  },[productDetails])

  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="row">
          <div className="col-lg-3 radio-group">
            <div className="px-3 row d-flex radio">
              {" "}
              <img
                className="pay"
                src="https://i.imgur.com/WIAP9Ku.jpg"
                alt="Credit"
              />
              <p className="my-auto">Credit Card</p>
            </div>
            <div className="px-3 row d-flex radio gray">
              {" "}
              <img
                className="pay"
                src="https://i.imgur.com/OdxcctP.jpg"
                alt="Debit"
              />
              <p className="my-auto">Debit Card</p>
            </div>
            <div className="px-3 mb-3 row d-flex radio gray">
              {" "}
              <img
                className="pay"
                src="https://i.imgur.com/cMk1MtK.jpg"
                alt="PayPal"
              />
              <p className="my-auto">PayPal</p>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="px-2 row">
              <div className="form-group col-md-6">
                {" "}
                <label className="form-control-label">Name on Card</label>{" "}
                <input
                  type="text"
                  id="cname"
                  name="cname"
                  placeholder="Johnny Doe"
                />{" "}
              </div>
              <div className="form-group col-md-6">
                {" "}
                <label className="form-control-label">Card Number</label>{" "}
                <input
                  type="text"
                  id="cnum"
                  name="cnum"
                  placeholder="1111 2222 3333 4444"
                />{" "}
              </div>
            </div>
            <div className="px-2 row">
              <div className="form-group col-md-6">
                {" "}
                <label className="form-control-label">
                  Expiration Date
                </label>{" "}
                <input type="text" id="exp" name="exp" placeholder="MM/YYYY" />{" "}
              </div>
              <div className="form-group col-md-6">
                {" "}
                <label className="form-control-label">CVV</label>{" "}
                <input type="text" id="cvv" name="cvv" placeholder="***" />{" "}
              </div>
            </div>
          </div>
          <div className="mt-2 col-lg-4">
            <div className="px-4 row d-flex justify-content-between">
              <p className="mb-1 text-left">Subtotal</p>
              <h6 className="mb-1 text-right">${subTotal}</h6>
            </div>
            <div className="px-4 row d-flex justify-content-between">
              <p className="mb-1 text-left">Shipping</p>
  <h6 className="mb-1 text-right">${shipping}</h6>
            </div>
            <div className="px-4 row d-flex justify-content-between" id="tax">
              <p className="mb-1 text-left">Total (tax included)</p>
  <h6 className="mb-1 text-right">${subTotal+shipping+tax}</h6>
            </div>{" "}
            <button className="btn-block btn-blue" onClick={() => {}}>
              {" "}
              <span>
                {" "}
                <span id="checkout">Checkout</span>{" "}
  <span id="check-amt">${subTotal+shipping+tax}</span>{" "}
              </span>{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Products = ({ productId, qty, removeProduct, updateQuantity }) => {
  const [Product, setProduct] = useState({});
  const {
    category = "no category",
    description,
    image,
    price = 0,
    title,
  } = Product;
  const [Quantity, setQuantity] = useState(Number(qty));
  const [priceTag, setPriceTag] = useState(Number(price));

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => {
      const qty = prevQuantity + 1;
      return qty;
    });
    updateProduct();
  };

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then((res) => res.json())
      .then((json) => {
        setProduct(json);
      });
  }, [productId]);

  useEffect(() => {
    const newPrice = price * Quantity;
    setPriceTag(newPrice);
    console.log("from329")
    updateQuantity(Quantity,price, productId);
  }, [Quantity, price]);

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => {
      if (prevQuantity > 1) {
        const qty = prevQuantity - 1;
        return qty;
      }
      return prevQuantity;
    });

    updateProduct();
  };

  const removeCartProduct = () => {
    removeProduct(productId);
  };
  const updateProduct = () => {
    updateQuantity(Quantity,price, productId);
  };

  return (
    <div className="row d-flex justify-content-center border-top">
      <div className="col-5">
        <div className="row d-flex">
          <div className="col d-flex justify-content-center">
            <img src={image} className="book-img" alt={title} />
          </div>
          <div className="my-auto flex-column d-flex pad-left">
            <h6 className="mob-text">{title}</h6>
            <p className="mob-text">{description}</p>
          </div>
        </div>
      </div>
      <div className="my-auto col-7">
        <div className="text-right row">
          <div className="col">
            <p className="mob-text">{category}</p>
          </div>
          <div className="col">
            <div className="px-3 row d-flex justify-content-end">
              <p className="mb-0" id="cnt1">
                <span>{Quantity}</span>
              </p>
              <div className="d-flex flex-column plus-minus">
                <span className="vsm-text plus" onClick={increaseQuantity}>
                  +
                </span>
                <span className="vsm-text minus" onClick={decreaseQuantity}>
                  -
                </span>
              </div>
            </div>
          </div>
          <div className="col">
            <h6 className="mob-text">Unit Price: ${price}</h6>
            <h6 className="mob-text">Cost: ${priceTag}</h6>
          </div>
          <div className="col">
            <button
              onClick={removeCartProduct}
              type="button"
              className="btn btn-danger"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
