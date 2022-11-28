import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "react-apollo";
import UPDATE_CART from "../graphql/updateCart.graphql"
import GET_PRODUCT from "../graphql/getProductBySku.graphql"
import { useCssHandles } from 'vtex.css-handles'
import "./styles.css"

const QuickOrder = () => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)

  const CSS_HANDLES = [
    "quickOrder_container",
    "quickOrder_form",
    "quickOrder_label-container",
    "quickOrder_label",
    "quickOrder_input",
    "quickOrder_input-btn",
    "quickOrder_title"
  ]
  const handles = useCssHandles(CSS_HANDLES)

  const handleChange = (evt: any) => {
    setInputText(evt.target.value)
    console.log("input changed", inputText);
  }
  useEffect(() => {
    console.log("El resultado de mi producto es:", product, search)
    if (product) {
      let skuId = parseInt(inputText)
      addToCart({
        variables: {
          salesChannel: "1",
          items: [
            {
              id: skuId,
              quantity: 1,
              seller: "1"
            }
          ]
        }
      })
        .then(() => {
          window.location.href = "/compra"
        })
    }
  }, [product, search])
  const addProductToCart = () => {
    //ingresar declaración de la mutación
    getProductData({
      variables: {
        sku: inputText
      }
    })
  }
  const searchProduct = (evt: any) => {
    evt.preventDefault();
    if (!inputText) {
      alert("No has seleccionado ningún SKU")
    } else {
      //Busqueda, data del producto
      setSearch(inputText)
      addProductToCart()
    }
  }
  return <div className={handles["quickOrder_container"]}>
    <h2 className={handles["quickOrder_title"]}> Easy fast</h2>
    <form className={handles["quickOrder_form"]} onSubmit={searchProduct}>
      <div className={handles["quickOrder_label-container"]} >
        <label className={handles["quickOrder_label"]} htmlFor="sku">Ingresa un SKU:</label>
        <input className={handles["quickOrder_input"]} id="sku" type="text" onChange={handleChange}></input>
      </div>
      <input className={handles["quickOrder_input-btn"]} type="submit" value="AGREGAR" />
    </form>
  </div>
}

export default QuickOrder
