import { useState } from "react";
import { useEth } from "./contexts/EthContext";
import "./styles.css";

function MainComp() {
  const { state: { contract, accounts } } = useEth();

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    category: "",
    subCategory: "",
    iotDeviceNumber: "", // New field added
  });

  const [newStakeholder, setNewStakeholder] = useState("");
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const count = await contract.methods.productCount().call();
      const productList = [];
      for (let i = 1; i <= count; i++) {
        const product = await contract.methods.products(i).call();
        productList.push(product);
      }
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddProduct = async () => {
    const { name, description, price, weight, category, subCategory, iotDeviceNumber } = productData;
    try {
      await contract.methods
        .addProduct(name, description, price, weight, category, subCategory, iotDeviceNumber, accounts[0])
        .send({ from: accounts[0] });
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateStakeholder = async () => {
    try {
      await contract.methods.updatePreviousStakeholder(newStakeholder).send({ from: accounts[0] });
      alert("Stakeholder updated successfully!");
    } catch (error) {
      console.error("Error updating stakeholder:", error);
    }
  };

  const handleBuyProduct = async (productId, price) => {
    try {
      await contract.methods.buyProduct(productId).send({ from: accounts[0], value: price });
      alert("Product bought successfully!");
    } catch (error) {
      console.error("Error buying product:", error);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>🌾 Farm Product Tracking DApp</h1>
        <p className="subtitle">Track and manage your farm products effortlessly</p>
      </header>

      <main className="content">
        <section className="form-section">
          <h2>Add a New Product</h2>
          <div className="form-container">
            <input
              type="text"
              placeholder="Product Name"
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
            />
            <textarea
              placeholder="Product Description"
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
            ></textarea>
            <input
              type="number"
              placeholder="Price (in wei)"
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Weight"
              onChange={(e) => setProductData({ ...productData, weight: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              onChange={(e) => setProductData({ ...productData, category: e.target.value })}
            />
            <input
              type="text"
              placeholder="Sub-Category"
              onChange={(e) => setProductData({ ...productData, subCategory: e.target.value })}
            />
            <input
              type="text"
              placeholder="IoT Device Number" // New input field
              onChange={(e) => setProductData({ ...productData, iotDeviceNumber: e.target.value })}
            />
            <button className="btn-primary" onClick={handleAddProduct}>
              Add Product
            </button>
          </div>
        </section>

        <section className="form-section">
          <h2>Update Stakeholder</h2>
          <div className="form-container">
            <input
              type="text"
              placeholder="New Stakeholder Address"
              onChange={(e) => setNewStakeholder(e.target.value)}
            />
            <button className="btn-secondary" onClick={handleUpdateStakeholder}>
              Update Stakeholder
            </button>
          </div>
        </section>

        <section className="products-section">
          <h2>Available Products</h2>
          <button className="btn-secondary" onClick={fetchProducts}>
            Load Products
          </button>
          <div className="product-list">
            {products.map((product, index) => (
              <div className="product-card" key={index}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p><strong>Price:</strong> {product.price} wei</p>
                <p><strong>Weight:</strong> {product.weight} kg</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Sub-Category:</strong> {product.subCategory}</p>
                <p><strong>IoT Device Number:</strong> {product.iotDeviceNumber}</p> {/* Display the new field */}
                <button
                  className="btn-primary"
                  onClick={() => handleBuyProduct(product.productId, product.price)}
                >
                  Buy Product
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MainComp;
