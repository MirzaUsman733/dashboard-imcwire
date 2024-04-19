import React, { useState } from "react";

function PaymentGateWay() {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    month: "",
    year: "",
    cvc: "",
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col min-h-screen space-y-4 my-5">
      <header className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <a
            className="flex items-center gap-2 font-semibold"
            href="#"
            rel="ugc"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
              <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
              <path d="M12 3v6"></path>
            </svg>
            <span className="">IMCWire</span>
          </a>
        </div>
      </header>
      <main className="flex-1">
        <form className="mx-4 space-y-4" onSubmit={handleSubmit}>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
                Payment
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter your payment information.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium leading-none"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="number"
                  className="text-sm font-medium leading-none"
                >
                  Card number
                </label>
                <input
                  type="number"
                  id="number"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="Enter your card number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="month"
                    className="text-sm font-medium leading-none"
                  >
                    Expires (Month)
                  </label>
                  <input
                    type="number"
                    id="month"
                    value={formData.month}
                    onChange={handleChange}
                    placeholder="MM"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="year"
                    className="text-sm font-medium leading-none"
                  >
                    Expires (Year)
                  </label>
                  <input
                    type="number"
                    id="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="YYYY"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="cvc"
                    className="text-sm font-medium leading-none"
                  >
                    CVC
                  </label>
                  <input
                    type="number"
                    id="cvc"
                    value={formData.cvc}
                    onChange={handleChange}
                    placeholder="CVC"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
                Billing address
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter your billing address information.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="first-name"
                    className="text-sm font-medium leading-none"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="last-name"
                    className="text-sm font-medium leading-none"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="text-sm font-medium leading-none"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="address-2"
                  className="text-sm font-medium leading-none"
                >
                  Address 2
                </label>
                <input
                  type="text"
                  id="address-2"
                  value={formData.address2}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="city"
                    className="text-sm font-medium leading-none"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="state"
                    className="text-sm font-medium leading-none"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="zip"
                    className="text-sm font-medium leading-none"
                  >
                    ZIP
                  </label>
                  <input
                    type="text"
                    id="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    placeholder="Enter your ZIP"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="country"
                    className="text-sm font-medium leading-none"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter your country"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full gap-4">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center btn-grad rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
            >
              Submit Payment
            </button>
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default PaymentGateWay;
