let tables = Array(10)
  .fill()
  .map((_, i) => ({
    id: i + 1,
    occupied: false,
    guests: 0,
    cart: [],
    orders: [],
  }));
let paymentHistory = [];
let categories = [
  { id: 1, name: "Drinks" },
  { id: 2, name: "Coffee" },
  { id: 3, name: "Milk Tea" },
];
let options = [
  { id: 1, name: "With Sugar" },
  { id: 2, name: "No Sugar" },
  { id: 3, name: "Half Sugar" },
];
let products = [
  { id: 1, name: "Mineral Water", price: 20, categoryId: 1, optionIds: [2] },
  { id: 2, name: "Cola", price: 30, categoryId: 1, optionIds: [1, 2] },
  { id: 3, name: "Americano", price: 50, categoryId: 2, optionIds: [1, 2] },
  { id: 4, name: "Latte", price: 60, categoryId: 2, optionIds: [1, 2] },
  {
    id: 5,
    name: "Pearl Milk Tea",
    price: 55,
    categoryId: 3,
    optionIds: [1, 2],
  },
  {
    id: 6,
    name: "Green Milk Tea",
    price: 50,
    categoryId: 3,
    optionIds: [1, 2],
  },
];
let mealSetCategories = [];
let mealSetItems = [];
let mealSetSteps = [];
let nextCategoryId = 4;
let nextOptionId = 4;
let nextProductId = 7;
let nextMealSetCategoryId = 1;
let nextMealSetItemId = 1;
let nextMealSetStepId = 1;
let selectedTable = null;
let currentCategoryId = categories[0]?.id || 0;
let selectedProduct = null;
let selectedMealSet = null;
let priceModifier = "";
let currentTab = "home";
let mealSetSelections = {};
let extraChargeFields = [];

// Show error message in DOM
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerText = message;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}

// Load data from localStorage
function loadData() {
  try {
    const savedTables = localStorage.getItem("tables");
    if (savedTables) {
      const parsedTables = JSON.parse(savedTables);
      if (Array.isArray(parsedTables)) {
        tables = parsedTables.map((t) => ({
          id: t.id || 0,
          occupied: typeof t.occupied === "boolean" ? t.occupied : false,
          guests: Number.isInteger(t.guests) ? t.guests : 0,
          cart: Array.isArray(t.cart) ? t.cart : [],
          orders: Array.isArray(t.orders) ? t.orders : [],
        }));
        if (tables.length !== 10 || !tables.every((t, i) => t.id === i + 1)) {
          console.warn("Table data incomplete, resetting.");
          resetTables();
        }
      } else {
        resetTables();
      }
    } else {
      resetTables();
    }
    const savedPayments = localStorage.getItem("paymentHistory");
    if (savedPayments) {
      const parsedPayments = JSON.parse(savedPayments);
      if (Array.isArray(parsedPayments)) paymentHistory = parsedPayments;
    }
    const savedCategories = localStorage.getItem("categories");
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);
      if (Array.isArray(parsedCategories)) {
        categories = parsedCategories;
        nextCategoryId = Math.max(...categories.map((c) => c.id || 0), 3) + 1;
      }
    }
    const savedOptions = localStorage.getItem("options");
    if (savedOptions) {
      const parsedOptions = JSON.parse(savedOptions);
      if (Array.isArray(parsedOptions)) {
        options = parsedOptions;
        nextOptionId = Math.max(...options.map((o) => o.id || 0), 3) + 1;
      }
    }
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      if (Array.isArray(parsedProducts)) {
        products = parsedProducts;
        nextProductId = Math.max(...products.map((p) => p.id || 0), 6) + 1;
      }
    }
    const savedMealSetCategories = localStorage.getItem("mealSetCategories");
    if (savedMealSetCategories) {
      const parsed = JSON.parse(savedMealSetCategories);
      if (Array.isArray(parsed)) {
        mealSetCategories = parsed;
        nextMealSetCategoryId =
          Math.max(...mealSetCategories.map((c) => c.id || 0), 0) + 1;
      }
    }
    const savedMealSetItems = localStorage.getItem("mealSetItems");
    if (savedMealSetItems) {
      const parsed = JSON.parse(savedMealSetItems);
      if (Array.isArray(parsed)) {
        mealSetItems = parsed;
        nextMealSetItemId =
          Math.max(...mealSetItems.map((i) => i.id || 0), 0) + 1;
      }
    }
    const savedMealSetSteps = localStorage.getItem("mealSetSteps");
    if (savedMealSetSteps) {
      const parsed = JSON.parse(savedMealSetSteps);
      if (Array.isArray(parsed)) {
        mealSetSteps = parsed;
        nextMealSetStepId =
          Math.max(...mealSetSteps.map((s) => s.id || 0), 0) + 1;
      }
    }
  } catch (error) {
    console.error("Error loading data:", error);
    resetTables();
  }
}

// Reset table data
function resetTables() {
  tables = Array(10)
    .fill()
    .map((_, i) => ({
      id: i + 1,
      occupied: false,
      guests: 0,
      cart: [],
      orders: [],
    }));
  saveData();
}

// Save data to localStorage
function saveData() {
  try {
    localStorage.setItem("tables", JSON.stringify(tables));
    localStorage.setItem("paymentHistory", JSON.stringify(paymentHistory));
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("options", JSON.stringify(options));
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem(
      "mealSetCategories",
      JSON.stringify(mealSetCategories)
    );
    localStorage.setItem("mealSetItems", JSON.stringify(mealSetItems));
    localStorage.setItem("mealSetSteps", JSON.stringify(mealSetSteps));
  } catch (error) {
    console.error("Error saving data:", error);
    showError("Unable to save data, please check browser settings!");
  }
}

// Switch main tab
function openTab(tab) {
  console.log(tab);
  currentTab = tab;
  const tabs = document.querySelectorAll(".sidebar .tab");
  console.log(tabs);
  const contents = document.querySelectorAll(".content");
  tabs.forEach((t) => t.classList.remove("active"));
  contents.forEach((c) => (c.style.display = "none"));
  const activeTab = document.querySelector(
    `.sidebar .tab[onclick="openTab('${tab}')"]`
  );
  if (activeTab) activeTab.classList.add("active");
  const content = document.getElementById(`${tab}-content`);
  if (content) content.style.display = "block";
  console.log(content);
  if (tab === "records") updatePaymentHistory();
  if (tab === "settings") openSubTab("products");
  if (tab === "mealset") openSubTab("mealset-categories");
  if (tab === "home") displayTables();
}

// Switch sub-tab
function openSubTab(subTab) {
  const subTabs = document.querySelectorAll(".sub-tabs .sub-tab");
  const subContents = document.querySelectorAll(".sub-table-content");
  subTabs.forEach((t) => t.classList.remove("active"));
  subContents.forEach((c) => (c.style.display = "none"));
  const activeSubTab = document.querySelector(
    `.sub-tabs .sub-tab[onclick="openSubTab('${subTab}')"]`
  );
  if (activeSubTab) activeSubTab.classList.add("active");
  const subContent = document.getElementById(`${subTab}-sub`);
  if (subContent) subContent.style.display = "block";
  if (subTab === "products") {
    updateCategorySelect();
    updateOptionSelect();
    updateProductList();
  }
  if (subTab === "categories") updateCategoryList();
  if (subTab === "options") updateOptionList();
  if (subTab === "mealset-categories") updateMealSetCategoryList();
  if (subTab === "mealset-items") {
    updateMealSetItemCategorySelect();
    updateMealSetItemStepSelect();
    updateMealSetItemList();
  }
  if (subTab === "mealset-steps") {
    updateMealSetStepProductSelect();
    updateMealSetStepList();
    extraChargeFields = [];
    updateExtraChargesContainer();
  }
}

// Display table grid
function displayTables() {
  const tableGrid = document.getElementById("table-grid");
  if (!tableGrid) {
    console.error("Table grid not found!");
    return;
  }
  tableGrid.innerHTML = "";
  tables.forEach((table) => {
    const tableDiv = document.createElement("div");
    tableDiv.className = `table ${
      table.occupied ? "table-occupied" : "table-empty"
    } ${currentTab !== "home" ? "disabled" : ""}`;
    tableDiv.innerText = table.occupied
      ? `Table ${table.id}: ${table.guests} guests`
      : `Table ${table.id}: Empty`;
    if (currentTab === "home") {
      tableDiv.onclick = () => selectTable(table.id);
    }
    tableGrid.appendChild(tableDiv);
  });
}

// Select table
function selectTable(tableId) {
  if (currentTab !== "home") {
    console.warn("Table selection attempted on non-home tab:", currentTab);
    openTab("home");
    return;
  }

  selectedTable = tables.find((t) => t.id === tableId);
  if (!selectedTable) {
    console.error(`Table ID ${tableId} not found.`);
    showError("Table selection error!");
    return;
  }
  console.log(`Selected table ${tableId}`);

  const controlPanel = document.getElementById("control-panel");
  const tableDetails = document.getElementById("table-details");
  const selectedTableText = document.getElementById("table-title");
  const openTableControls = document.getElementById("open-table-controls");
  const tableDetailsTitle = document.getElementById("table-details-title");

  if (
    !controlPanel ||
    !tableDetails ||
    !selectedTableText ||
    !openTableControls ||
    !tableDetailsTitle
  ) {
    console.error("Control panel or table details not found:", {
      controlPanel: !!controlPanel,
      tableDetails: !!tableDetails,
      selectedTableText: !!selectedTableText,
      openTableControls: !!openTableControls,
      tableDetailsTitle: !!tableDetailsTitle,
      homeContentVisible:
        document.getElementById("home-content")?.style.display === "block",
    });
    showError("Interface load failed, please refresh the page!");
    return;
  }

  selectedTableText.innerText = `Table ${tableId}`;
  tableDetailsTitle.innerText = `Table ${tableId} Details`;
  if (selectedTable.occupied) {
    controlPanel.style.display = "none";
    tableDetails.style.display = "block";
    updateTableDetails();
    openPosDialog(tableId);
  } else {
    controlPanel.style.display = "block";
    tableDetails.style.display = "none";
    openTableControls.style.display = "block";
    document.getElementById("num-guests").value = "";
  }
}

// Open table
function openTable() {
  if (!selectedTable) {
    console.error("No table selected for opening.");
    showError("Please select a table!");
    return;
  }
  const numGuests = parseInt(document.getElementById("num-guests").value);
  if (!numGuests || numGuests < 1 || numGuests > 10) {
    showError("Please enter valid number of guests (1-10)!");
    return;
  }
  selectedTable.occupied = true;
  selectedTable.guests = numGuests;
  selectedTable.cart = [];
  selectedTable.orders = [];
  saveData();
  displayTables();
  document.getElementById("control-panel").style.display = "none";
  selectedTable = null;
}

// Clear table
function clearTable() {
  if (!selectedTable) {
    console.error("No table selected for clearing.");
    showError("Please select a table!");
    return;
  }
  console.log(`Clearing table ${selectedTable.id}`);
  selectedTable.occupied = false;
  selectedTable.guests = 0;
  selectedTable.cart = [];
  selectedTable.orders = [];
  saveData();
  displayTables();
  document.getElementById("table-details").style.display = "none";
  selectedTable = null;
}

// Delete order item
function deleteOrderItem(orderIndex, itemIndex) {
  if (!selectedTable) {
    console.error("No table selected for deleting order item.");
    showError("Please select a table!");
    return;
  }
  const order = selectedTable.orders[orderIndex];
  if (!order) {
    console.error("Order not found:", orderIndex);
    showError("Order not found!");
    return;
  }
  order.items.splice(itemIndex, 1);
  if (order.items.length === 0) {
    selectedTable.orders.splice(orderIndex, 1);
  } else {
    order.total = order.items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  }
  saveData();
  updateTableDetails();
  showError("Order item deleted!");
}

// Open POS dialog
function openPosDialog(tableId) {
  try {
    const dialog = document.getElementById("pos-dialog");
    if (!dialog) throw new Error("POS dialog not found.");
    selectedTable = tables.find((t) => t.id === tableId);
    if (!selectedTable) throw new Error(`Table ID ${tableId} not found.`);
    console.log(`Opening POS dialog for table ${tableId}`);
    document.getElementById(
      "pos-table-title"
    ).innerText = `Table ${tableId} Order`;
    currentCategoryId = categories[0]?.id || 0;
    updateCategoryTabs();
    displayPosProducts();
    updatePosCart();
    dialog.showModal();
  } catch (error) {
    console.error("Error opening POS dialog:", error);
    showError("Unable to open POS window, please refresh!");
  }
}

// Close POS dialog
function closePosDialog() {
  const dialog = document.getElementById("pos-dialog");
  if (dialog) dialog.close();
  console.log(
    "POS dialog closed, retaining selectedTable:",
    selectedTable ? selectedTable.id : "none"
  );
}

// Update category tabs
function updateCategoryTabs() {
  const categoryTabs = document.getElementById("category-tabs");
  if (!categoryTabs) {
    console.error("Category tabs not found.");
    return;
  }
  categoryTabs.innerHTML = "";
  categories.forEach((category) => {
    const tab = document.createElement("div");
    tab.className = `tab category ${
      category.id === currentCategoryId ? "active" : ""
    }`;
    tab.innerText = category.name;
    tab.onclick = () => switchCategory(category.id);
    categoryTabs.appendChild(tab);
  });
  // Add Meal Sets tab
  const mealSetTab = document.createElement("div");
  mealSetTab.className = `tab category ${
    currentCategoryId === "mealsets" ? "active" : ""
  }`;
  mealSetTab.innerText = "Meal Sets";
  mealSetTab.onclick = () => switchCategory("mealsets");
  categoryTabs.appendChild(mealSetTab);
}

// Switch product category
function switchCategory(categoryId) {
  currentCategoryId = categoryId;
  updateCategoryTabs();
  displayPosProducts();
}

// Display POS products
function displayPosProducts() {
  const productList = document.getElementById("pos-product-list");
  if (!productList) {
    console.error("Product list not found.");
    return;
  }
  productList.innerHTML = "";
  if (currentCategoryId === "mealsets") {
    mealSetItems.forEach((item) => {
      const category = mealSetCategories.find((c) => c.id === item.categoryId);
      const price =
        item.price ||
        mealSetSteps
          .filter((s) => item.stepIds.includes(s.id))
          .flatMap((s) =>
            s.productIds.map((pid) => {
              const product = products.find((p) => p.id === pid);
              const extra = s.extraCharges?.[pid] || 0;
              return (product?.price || 0) + extra;
            })
          )
          .reduce((sum, price) => sum + price, 0);
      const itemDiv = document.createElement("div");
      itemDiv.className = "product-item";
      itemDiv.innerHTML = `${item.name} (${
        category ? category.name : "N/A"
      }) - $${price}`;
      itemDiv.onclick = () => openMealSetDialog(item);
      productList.appendChild(itemDiv);
    });
  } else {
    products
      .filter((p) => p.categoryId === currentCategoryId)
      .forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-item";
        productDiv.innerHTML = `${product.name} - $${product.price}`;
        productDiv.onclick = () => openOptionDialog(product);
        productList.appendChild(productDiv);
      });
  }
}

// Open meal set dialog
function openMealSetDialog(mealSetItem) {
  selectedMealSet = mealSetItem;
  mealSetSelections = {};
  const dialog = document.getElementById("mealset-dialog");
  if (!dialog) {
    console.error("Meal set dialog not found.");
    return;
  }
  document.getElementById(
    "mealset-item-name"
  ).innerText = `Configure ${mealSetItem.name}`;
  const stepsContainer = document.getElementById("mealset-steps");
  stepsContainer.innerHTML = "";
  mealSetItem.stepIds.forEach((stepId) => {
    const step = mealSetSteps.find((s) => s.id === stepId);
    if (!step) return;
    const stepDiv = document.createElement("div");
    stepDiv.innerHTML = `
          <h4>${step.name} (${
      step.isMandatory ? "Mandatory" : "Optional"
    }, Select ${step.minSelections}-${step.maxSelections})</h4>
          <select id="mealset-step-${step.id}" multiple>
            ${step.productIds
              .map((pid) => {
                const product = products.find((p) => p.id === pid);
                const extra = step.extraCharges?.[pid] || 0;
                return product
                  ? `<option value="${product.id}">${product.name} - $${
                      product.price
                    }${extra ? ` (+$${extra})` : ""}</option>`
                  : "";
              })
              .join("")}
          </select>
        `;
    stepsContainer.appendChild(stepDiv);
  });
  dialog.showModal();
}

// Confirm meal set selections
function confirmMealSet() {
  if (!selectedTable || !selectedMealSet) {
    console.error("No table or meal set selected.");
    return;
  }
  let totalPrice = selectedMealSet.price || 0;
  const mealSetCartItem = {
    id: `mealset-${selectedMealSet.id}`,
    name: selectedMealSet.name,
    items: [],
    price: 0,
    quantity: 1,
  };
  let valid = true;
  selectedMealSet.stepIds.forEach((stepId) => {
    const step = mealSetSteps.find((s) => s.id === stepId);
    if (!step) return;
    const select = document.getElementById(`mealset-step-${step.id}`);
    const selectedOptions = Array.from(select.selectedOptions).map((o) =>
      parseInt(o.value)
    );
    if (step.isMandatory && selectedOptions.length < step.minSelections) {
      showError(
        `Please select at least ${step.minSelections} item(s) for ${step.name}!`
      );
      valid = false;
      return;
    }
    if (selectedOptions.length > step.maxSelections) {
      showError(
        `You can select up to ${step.maxSelections} item(s) for ${step.name}!`
      );
      valid = false;
      return;
    }
    selectedOptions.forEach((productId) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const extraCharge = step.extraCharges?.[productId] || 0;
        mealSetCartItem.items.push({
          stepId: step.id,
          stepName: step.name,
          productId: product.id,
          productName: product.name,
          price: product.price,
          extraCharge: extraCharge,
          optionId: product.optionIds[0] || null,
        });
        if (!selectedMealSet.price) {
          totalPrice += product.price + extraCharge;
        }
      }
    });
  });
  if (!valid) return;
  mealSetCartItem.price = totalPrice;
  const existingItem = selectedTable.cart.find(
    (item) =>
      item.id === mealSetCartItem.id &&
      JSON.stringify(item.items) === JSON.stringify(mealSetCartItem.items)
  );
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    selectedTable.cart.push(mealSetCartItem);
  }
  saveData();
  updatePosCart();
  document.getElementById("mealset-dialog").close();
  selectedMealSet = null;
  mealSetSelections = {};
  showError("Meal set added to cart!");
}

// Cancel meal set selection
function cancelMealSet() {
  document.getElementById("mealset-dialog").close();
  selectedMealSet = null;
  mealSetSelections = {};
}

// Open option dialog
function openOptionDialog(product) {
  selectedProduct = product;
  const dialog = document.getElementById("option-dialog");
  if (!dialog) {
    console.error("Option dialog not found.");
    return;
  }
  document.getElementById(
    "option-product-name"
  ).innerText = `Select ${product.name} Options`;
  const sugarSelect = document.getElementById("sugar-option");
  sugarSelect.innerHTML = product.optionIds
    .map((id) => {
      const option = options.find((o) => o.id === id);
      return option
        ? `<option value="${option.id}">${option.name}</option>`
        : "";
    })
    .join("");
  dialog.showModal();
}

// Confirm product option
function confirmProduct() {
  if (!selectedTable || !selectedProduct) {
    console.error("No table or product selected.");
    return;
  }
  const optionId = parseInt(document.getElementById("sugar-option").value);
  const option = options.find((o) => o.id === optionId);
  if (!option) {
    showError("Invalid option selected!");
    return;
  }
  const existingItem = selectedTable.cart.find(
    (item) => item.id === selectedProduct.id && item.optionId === optionId
  );
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    selectedTable.cart.push({
      ...selectedProduct,
      optionId: optionId,
      quantity: 1,
    });
  }
  saveData();
  updatePosCart();
  document.getElementById("option-dialog").close();
  selectedProduct = null;
}

// Cancel product selection
function cancelProduct() {
  document.getElementById("option-dialog").close();
  selectedProduct = null;
}

// Update POS cart display
function updatePosCart() {
  const cartItems = document.getElementById("pos-cart-items");
  if (!cartItems) {
    console.error("Cart items not found.");
    return;
  }
  cartItems.innerHTML = "";
  if (selectedTable) {
    selectedTable.cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      if (item.id.startsWith("mealset-")) {
        const itemsList = item.items
          .map(
            (i) =>
              `${i.productName} (${i.stepName}${
                i.extraCharge ? `, +$${i.extraCharge}` : ""
              })`
          )
          .join(", ");
        cartItem.innerHTML = `
              ${item.name} x${item.quantity} - $${item.price * item.quantity}
              <div>${itemsList}</div>
              <div class="quantity-controls">
                <button onclick="updateCartQuantity(${index}, 1)">+</button>
                <button onclick="updateCartQuantity(${index}, -1)">-</button>
                <button onclick="removeCartItem(${index})">Delete</button>
              </div>
            `;
      } else {
        const option = options.find((o) => o.id === item.optionId);
        cartItem.innerHTML = `
              ${item.name} (${option ? option.name : "N/A"}) x${
          item.quantity
        } - $${item.price * item.quantity}
              <div class="quantity-controls">
                <button onclick="updateCartQuantity(${index}, 1)">+</button>
                <button onclick="updateCartQuantity(${index}, -1)">-</button>
                <button onclick="removeCartItem(${index})">Delete</button>
              </div>
            `;
      }
      cartItems.appendChild(cartItem);
    });
    const total = selectedTable.cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
    document.getElementById("pos-total").innerText = total;
  }
}

// Update cart quantity
function updateCartQuantity(index, change) {
  if (!selectedTable) {
    console.error("No table selected for updating cart.");
    return;
  }
  const item = selectedTable.cart[index];
  if (item) {
    item.quantity = Math.max(1, (item.quantity || 1) + change);
    saveData();
    updatePosCart();
  }
}

// Remove cart item
function removeCartItem(index) {
  if (!selectedTable) {
    console.error("No table selected for removing cart item.");
    return;
  }
  selectedTable.cart.splice(index, 1);
  saveData();
  updatePosCart();
}

// Submit order
function submitOrder() {
  if (!selectedTable) {
    console.error("No table selected for submitting order.");
    showError("Please select a table!");
    return;
  }
  if (selectedTable.cart.length === 0) {
    showError("Cart is empty!");
    return;
  }
  const total = selectedTable.cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  selectedTable.orders.push({
    items: selectedTable.cart.map((item) => ({
      ...item,
      optionName: item.id.startsWith("mealset-")
        ? null
        : options.find((o) => o.id === item.optionId)?.name || "N/A",
      items: item.id.startsWith("mealset-") ? item.items : null,
    })),
    total: total,
    timestamp: new Date().toLocaleString("en-US"),
  });
  selectedTable.cart = [];
  saveData();
  updatePosCart();
  document.getElementById("pos-dialog").close();
  updateTableDetails();
  console.log("Order submitted, retaining selectedTable:", selectedTable.id);
}

// Update table details
function updateTableDetails() {
  if (!selectedTable) {
    console.error("No table selected for updating details.");
    showError("Unable to load table details, please reselect table!");
    return;
  }
  const orderHistory = document.getElementById("order-history");
  const tableTotal = document.getElementById("table-total");
  if (!orderHistory || !tableTotal) {
    console.error("Order history or total not found.");
    return;
  }
  orderHistory.innerHTML = "";
  let total = 0;
  if (selectedTable.orders.length > 0) {
    selectedTable.orders.forEach((order, orderIndex) => {
      const orderDiv = document.createElement("div");
      orderDiv.innerHTML = `<strong>Order ${orderIndex + 1} (${
        order.timestamp
      }):</strong>`;
      order.items.forEach((item, itemIndex) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "order-item";
        let itemText;
        if (item.id.startsWith("mealset-")) {
          const itemsList = item.items
            .map(
              (i) =>
                `${i.productName} (${i.stepName}${
                  i.extraCharge ? `, +$${i.extraCharge}` : ""
                })`
            )
            .join(", ");
          itemText = `${item.name} x${item.quantity} - $${
            item.price * item.quantity
          } [${itemsList}]`;
        } else {
          itemText = `${item.name} (${item.optionName}) x${item.quantity} - $${
            item.price * item.quantity
          }`;
        }
        itemDiv.innerHTML = `
              ${itemText}
              <button class="delete-btn" onclick="deleteOrderItem(${orderIndex}, ${itemIndex})">Delete</button>
            `;
        orderDiv.appendChild(itemDiv);
      });
      orderDiv.innerHTML += `<div>Subtotal: $${order.total}</div><hr>`;
      orderHistory.appendChild(orderDiv);
      total += order.total;
    });
  } else {
    orderHistory.innerText = "No orders recorded";
  }
  tableTotal.innerText = total;
}

// Print receipt
function printTable() {
  if (!selectedTable) {
    console.error("No table selected for printing.");
    showError("Please select a table!");
    return;
  }
  if (selectedTable.orders.length === 0) {
    showError("No orders to print!");
    return;
  }
  const printArea = document.getElementById("print-area");
  printArea.innerHTML = `
        <h2>Table ${selectedTable.id} Receipt</h2>
        <p>Print Time: ${new Date().toLocaleString("en-US")}</p>
        <hr>
        ${selectedTable.orders
          .map(
            (order, index) => `
          <h3>Order ${index + 1} (${order.timestamp})</h3>
          ${order.items
            .map(
              (item) => `
            <p>${item.name}${
                item.id.startsWith("mealset-")
                  ? ` [${item.items
                      .map(
                        (i) =>
                          `${i.productName} (${i.stepName}${
                            i.extraCharge ? `, +$${i.extraCharge}` : ""
                          })`
                      )
                      .join(", ")}]`
                  : ` (${item.optionName})`
              } x${item.quantity} - $${item.price * item.quantity}</p>
          `
            )
            .join("")}
          <p>Subtotal: $${order.total}</p>
          <hr>
        `
          )
          .join("")}
        <h3>Total: $${selectedTable.orders.reduce(
          (sum, order) => sum + order.total,
          0
        )}</h3>
      `;
  window.print();
}

// Open checkout dialog
function openCheckout() {
  if (!selectedTable) {
    console.error("No table selected for checkout.");
    showError("Please select a table!");
    return;
  }
  console.log(`Opening checkout for table ${selectedTable.id}`);
  if (selectedTable.orders.length === 0) {
    showError("No orders to checkout!");
    return;
  }
  const dialog = document.getElementById("checkout-dialog");
  const checkoutItems = document.getElementById("checkout-items");
  const checkoutTotal = document.getElementById("checkout-total");
  if (!dialog || !checkoutItems || !checkoutTotal) {
    console.error("Checkout dialog elements not found.");
    showError("Checkout interface failed, please refresh!");
    return;
  }
  document.getElementById(
    "checkout-table-title"
  ).innerText = `Table ${selectedTable.id} Checkout`;
  checkoutItems.innerHTML = "";
  let total = 0;
  selectedTable.orders.forEach((order, index) => {
    const orderDiv = document.createElement("div");
    orderDiv.innerHTML = `<strong>Order ${index + 1} (${
      order.timestamp
    }):</strong>`;
    order.items.forEach((item) => {
      const itemDiv = document.createElement("div");
      if (item.id.startsWith("mealset-")) {
        const itemsList = item.items
          .map(
            (i) =>
              `${i.productName} (${i.stepName}${
                i.extraCharge ? `, +$${i.extraCharge}` : ""
              })`
          )
          .join(", ");
        itemDiv.innerText = `${item.name} x${item.quantity} - $${
          item.price * item.quantity
        } [${itemsList}]`;
      } else {
        itemDiv.innerText = `${item.name} (${item.optionName}) x${
          item.quantity
        } - $${item.price * item.quantity}`;
      }
      orderDiv.appendChild(itemDiv);
    });
    checkoutItems.appendChild(orderDiv);
    total += order.total;
  });
  checkoutTotal.innerText = total;
  priceModifier = "";
  document.getElementById("price-modifier").value = "";
  dialog.showModal();
}

// Number pad input
function appendToPriceModifier(value) {
  priceModifier += value;
  document.getElementById("price-modifier").value = priceModifier;
}

// Clear number pad input
function clearPriceModifier() {
  priceModifier = "";
  document.getElementById("price-modifier").value = "";
  updateCheckoutTotal();
}

// Apply price modifier
function applyPriceModifier(operation, unit) {
  const value = parseFloat(priceModifier);
  if (isNaN(value)) {
    showError("Please enter a valid number!");
    return;
  }
  const checkoutTotal = document.getElementById("checkout-total");
  let total = parseFloat(checkoutTotal.innerText);
  if (unit === "%") {
    if (operation === "+") total *= 1 + value / 100;
    else if (operation === "-") total *= 1 - value / 100;
  } else if (unit === "$") {
    if (operation === "+") total += value;
    else if (operation === "-") total -= value;
  }
  total = Math.round(total);
  if (total < 0) total = 0;
  checkoutTotal.innerText = total;
  priceModifier = "";
  document.getElementById("price-modifier").value = "";
}

// Update checkout total
function updateCheckoutTotal() {
  if (!selectedTable) {
    console.error("No table selected for updating checkout total.");
    return;
  }
  const checkoutTotal = document.getElementById("checkout-total");
  const total = selectedTable.orders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  checkoutTotal.innerText = total;
}

// Confirm checkout
function confirmCheckout() {
  if (!selectedTable) {
    console.error("No table selected for checkout.");
    showError("Please select a table!");
    return;
  }
  const total = parseFloat(document.getElementById("checkout-total").innerText);
  paymentHistory.push({
    tableId: selectedTable.id,
    amount: total,
    timestamp: new Date().toLocaleString("en-US"),
    orders: JSON.parse(JSON.stringify(selectedTable.orders)), // Deep copy
  });
  document.getElementById("checkout-dialog").close();
  const confirmDialog = document.getElementById("confirm-dialog");
  document.getElementById(
    "confirm-message"
  ).innerText = `Table ${selectedTable.id} Checked Out $${total}`;
  confirmDialog.showModal();
}

// Complete checkout
function confirmCheckoutComplete() {
  if (!selectedTable) {
    console.error("No table selected for completing checkout.");
    return;
  }
  console.log(`Checkout completed for table ${selectedTable.id}`);
  selectedTable.occupied = false;
  selectedTable.guests = 0;
  selectedTable.orders = [];
  selectedTable.cart = [];
  saveData();
  document.getElementById("confirm-dialog").close();
  document.getElementById("table-details").style.display = "none";
  displayTables();
  openTab("home");
  selectedTable = null;
}

// Update payment history
function updatePaymentHistory() {
  const paymentHistoryDiv = document.getElementById("payment-history");
  if (!paymentHistoryDiv) {
    console.error("Payment history not found.");
    return;
  }
  paymentHistoryDiv.innerHTML = "";
  if (paymentHistory.length > 0) {
    paymentHistory.forEach((record, index) => {
      const recordDiv = document.createElement("div");
      recordDiv.className = "payment-item";
      let itemsHtml = "";
      if (record.orders && record.orders.length > 0) {
        record.orders.forEach((order, orderIndex) => {
          itemsHtml += `<div><strong>Order ${orderIndex + 1} (${
            order.timestamp
          }):</strong></div>`;
          order.items.forEach((item) => {
            if (item.id.startsWith("mealset-")) {
              const itemsList = item.items
                .map(
                  (i) =>
                    `${i.productName} (${i.stepName}${
                      i.extraCharge ? `, +$${i.extraCharge}` : ""
                    })`
                )
                .join(", ");
              itemsHtml += `<div>${item.name} x${item.quantity} - $${
                item.price * item.quantity
              } [${itemsList}]</div>`;
            } else {
              itemsHtml += `<div>${item.name} (${item.optionName}) x${
                item.quantity
              } - $${item.price * item.quantity}</div>`;
            }
          });
          itemsHtml += `<div>Subtotal: $${order.total}</div><hr>`;
        });
      } else {
        itemsHtml = "<div>No items recorded</div>";
      }
      recordDiv.innerHTML = `
            <div>
              <strong>Record ${index + 1} (${record.timestamp}):</strong>
              <div>Table ${record.tableId} - $${record.amount}</div>
              ${itemsHtml}
            </div>
          `;
      paymentHistoryDiv.appendChild(recordDiv);
    });
  } else {
    paymentHistoryDiv.innerText = "No payment records";
  }
}

// Add category
function addCategory() {
  const name = document.getElementById("category-name").value.trim();
  if (!name) {
    showError("Please enter a category name!");
    return;
  }
  if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    showError("Category already exists!");
    return;
  }
  categories.push({ id: nextCategoryId++, name });
  saveData();
  updateCategoryList();
  updateCategorySelect();
  document.getElementById("category-name").value = "";
  showError("Category added!");
}

// Delete category
function deleteCategory(categoryId) {
  if (products.some((p) => p.categoryId === categoryId)) {
    showError("Cannot delete category in use by products!");
    return;
  }
  categories = categories.filter((c) => c.id !== categoryId);
  saveData();
  updateCategoryList();
  updateCategorySelect();
  updateCategoryTabs();
}

// Update category list
function updateCategoryList() {
  const categoryList = document.getElementById("category-list");
  if (!categoryList) {
    console.error("Category list not found.");
    return;
  }
  categoryList.innerHTML = "";
  categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `
          ${category.name}
          <button class="delete-btn" onclick="deleteCategory(${category.id})">Delete</button>
        `;
    categoryList.appendChild(categoryDiv);
  });
  if (categories.length === 0) {
    categoryList.innerText = "No categories";
  }
}

// Add option
function addOption() {
  const name = document.getElementById("option-name").value.trim();
  if (!name) {
    showError("Please enter an option name!");
    return;
  }
  if (options.some((o) => o.name.toLowerCase() === name.toLowerCase())) {
    showError("Option already exists!");
    return;
  }
  options.push({ id: nextOptionId++, name });
  saveData();
  updateOptionList();
  updateOptionSelect();
  document.getElementById("option-name").value = "";
  showError("Option added!");
}

// Delete option
function deleteOption(optionId) {
  products.forEach(
    (p) => (p.optionIds = p.optionIds.filter((id) => id !== optionId))
  );
  options = options.filter((o) => o.id !== optionId);
  saveData();
  updateOptionList();
  updateOptionSelect();
  updateProductList();
}

// Update option list
function updateOptionList() {
  const optionList = document.getElementById("option-list");
  if (!optionList) {
    console.error("Option list not found.");
    return;
  }
  optionList.innerHTML = "";
  options.forEach((option) => {
    const optionDiv = document.createElement("div");
    optionDiv.innerHTML = `
          ${option.name}
          <button class="delete-btn" onclick="deleteOption(${option.id})">Delete</button>
        `;
    optionList.appendChild(optionDiv);
  });
  if (options.length === 0) {
    optionList.innerText = "No options";
  }
}

// Update category select
function updateCategorySelect() {
  const categorySelect = document.getElementById("product-category");
  if (!categorySelect) {
    console.error("Category select not found.");
    return;
  }
  categorySelect.innerHTML =
    '<option value="">Select Category</option>' +
    categories
      .map((c) => `<option value="${c.id}">${c.name}</option>`)
      .join("");
}

// Update option select
function updateOptionSelect() {
  const optionSelect = document.getElementById("product-options");
  if (!optionSelect) {
    console.error("Option select not found.");
    return;
  }
  optionSelect.innerHTML = options
    .map((o) => `<option value="${o.id}">${o.name}</option>`)
    .join("");
}

// Add product
function addProduct() {
  const name = document.getElementById("product-name").value.trim();
  const price = parseFloat(document.getElementById("product-price").value);
  const categoryId = parseInt(
    document.getElementById("product-category").value
  );
  const optionIds = Array.from(
    document.getElementById("product-options").selectedOptions
  ).map((o) => parseInt(o.value));
  if (
    !name ||
    isNaN(price) ||
    price < 0 ||
    !categoryId ||
    optionIds.length === 0
  ) {
    showError(
      "Please fill in valid product name, price, category, and at least one option!"
    );
    return;
  }
  if (!categories.find((c) => c.id === categoryId)) {
    showError("Invalid category selected!");
    return;
  }
  if (optionIds.some((id) => !options.find((o) => o.id === id))) {
    showError("Invalid options selected!");
    return;
  }
  products.push({
    id: nextProductId++,
    name,
    price: Math.round(price),
    categoryId,
    optionIds,
  });
  saveData();
  updateProductList();
  updateCategoryTabs();
  updateMealSetStepProductSelect();
  document.getElementById("product-name").value = "";
  document.getElementById("product-price").value = "";
  document.getElementById("product-category").value = "";
  document.getElementById("product-options").selectedIndex = -1;
  showError("Product added!");
}

// Delete product
function deleteProduct(productId) {
  products = products.filter((p) => p.id !== productId);
  mealSetSteps.forEach((s) => {
    s.productIds = s.productIds.filter((id) => id !== productId);
    if (s.extraCharges) {
      delete s.extraCharges[productId];
    }
  });
  saveData();
  updateProductList();
  updateMealSetStepProductSelect();
  updateMealSetStepList();
}

// Update product list
function updateProductList() {
  const productList = document.getElementById("product-list");
  if (!productList) {
    console.error("Product list not found.");
    return;
  }
  productList.innerHTML = "";
  products.forEach((product) => {
    const category = categories.find((c) => c.id === product.categoryId);
    const optionNames = product.optionIds
      .map((id) => options.find((o) => o.id === id)?.name || "N/A")
      .join(", ");
    const productDiv = document.createElement("div");
    productDiv.innerHTML = `
          ${product.name} (${category ? category.name : "N/A"}) - $${
      product.price
    } [${optionNames}]
          <button class="delete-btn" onclick="deleteProduct(${
            product.id
          })">Delete</button>
        `;
    productList.appendChild(productDiv);
  });
  if (products.length === 0) {
    productList.innerText = "No products";
  }
}

// Add meal set category
function addMealSetCategory() {
  const name = document.getElementById("mealset-category-name").value.trim();
  if (!name) {
    showError("Please enter a category name!");
    return;
  }
  if (
    mealSetCategories.some((c) => c.name.toLowerCase() === name.toLowerCase())
  ) {
    showError("Meal set category already exists!");
    return;
  }
  mealSetCategories.push({ id: nextMealSetCategoryId++, name });
  saveData();
  updateMealSetCategoryList();
  updateMealSetItemCategorySelect();
  document.getElementById("mealset-category-name").value = "";
  showError("Meal set category added!");
}

// Delete meal set category
function deleteMealSetCategory(categoryId) {
  if (mealSetItems.some((i) => i.categoryId === categoryId)) {
    showError("Cannot delete category in use by meal set items!");
    return;
  }
  mealSetCategories = mealSetCategories.filter((c) => c.id !== categoryId);
  saveData();
  updateMealSetCategoryList();
  updateMealSetItemCategorySelect();
}

// Update meal set category list
function updateMealSetCategoryList() {
  const list = document.getElementById("mealset-category-list");
  if (!list) {
    console.error("Meal set category list not found.");
    return;
  }
  list.innerHTML = "";
  mealSetCategories.forEach((category) => {
    const div = document.createElement("div");
    div.innerHTML = `
          ${category.name}
          <button class="delete-btn" onclick="deleteMealSetCategory(${category.id})">Delete</button>
        `;
    list.appendChild(div);
  });
  if (mealSetCategories.length === 0) {
    list.innerText = "No meal set categories";
  }
}

// Add meal set item
function addMealSetItem() {
  const name = document.getElementById("mealset-item-name").value.trim();
  const price =
    parseFloat(document.getElementById("mealset-item-price").value) || 0;
  const categoryId = parseInt(
    document.getElementById("mealset-item-category").value
  );
  const stepIds = Array.from(
    document.getElementById("mealset-item-steps").selectedOptions
  ).map((o) => parseInt(o.value));
  if (
    !name ||
    isNaN(price) ||
    price < 0 ||
    !categoryId ||
    stepIds.length === 0
  ) {
    showError(
      "Please fill in valid name, price (≥0), category, and at least one step!"
    );
    return;
  }
  if (!mealSetCategories.find((c) => c.id === categoryId)) {
    showError("Invalid category selected!");
    return;
  }
  if (stepIds.some((id) => !mealSetSteps.find((s) => s.id === id))) {
    showError("Invalid steps selected!");
    return;
  }
  mealSetItems.push({
    id: nextMealSetItemId++,
    name,
    price: Math.round(price),
    categoryId,
    stepIds,
  });
  saveData();
  updateMealSetItemList();
  document.getElementById("mealset-item-name").value = "";
  document.getElementById("mealset-item-price").value = "";
  document.getElementById("mealset-item-category").value = "";
  document.getElementById("mealset-item-steps").selectedIndex = -1;
  showError("Meal set item added!");
}

// Delete meal set item
function deleteMealSetItem(itemId) {
  mealSetItems = mealSetItems.filter((i) => i.id !== itemId);
  saveData();
  updateMealSetItemList();
}

// Update meal set item list
function updateMealSetItemList() {
  const list = document.getElementById("mealset-item-list");
  if (!list) {
    console.error("Meal set item list not found.");
    return;
  }
  list.innerHTML = "";
  mealSetItems.forEach((item) => {
    const category = mealSetCategories.find((c) => c.id === item.categoryId);
    const stepNames = item.stepIds
      .map((id) => mealSetSteps.find((s) => s.id === id)?.name || "N/A")
      .join(", ");
    const div = document.createElement("div");
    div.innerHTML = `
          ${item.name} (${category ? category.name : "N/A"}) - $${
      item.price
    } [${stepNames}]
          <button class="delete-btn" onclick="deleteMealSetItem(${
            item.id
          })">Delete</button>
        `;
    list.appendChild(div);
  });
  if (mealSetItems.length === 0) {
    list.innerText = "No meal set items";
  }
}

// Add extra charge field
function addExtraChargeField() {
  const container = document.getElementById("extra-charges-container");
  if (!container) return;
  const index = extraChargeFields.length;
  const div = document.createElement("div");
  div.className = "extra-charge";
  div.id = `extra-charge-${index}`;
  div.innerHTML = `
    <select id="extra-charge-product-${index}" class="form-control">
      ${products
        .map((p) => `<option value="${p.id}">${p.name}</option>`)
        .join("")}
    </select>
    <input type="number" id="extra-charge-amount-${index}" class="form-control" placeholder="Amount">
  `;
  container.appendChild(div);
  extraChargeFields.push(div);
}

// Update extra charges container
function updateExtraChargesContainer() {
  const container = document.getElementById("extra-charges-container");
  if (!container) return;
  container.innerHTML = "";
  extraChargeFields = [];
}

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  openTab("home");
  displayTables();
  updateCategoryList();
  updateOptionList();
  updateProductList();
  updateMealSetCategoryList();
  updateMealSetItemList();
  updateMealSetStepList();
});
