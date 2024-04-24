import { useState } from "react";
import AddressInputs from "./AddressInputs";
import { useSession } from "next-auth/react";

export default function UserForm({ user, onSave }) {
  const { data: session, status: sessionStatus } = useSession();
  console.log(session)
  const [userName, setUserName] = useState(session?.user?.name || '');
  const [userEmail, setUserEmail] = useState(session?.user?.email || '')
  const [image, setImage] = useState(user?.image || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');
  const [admin, setAdmin] = useState(user?.admin || false);
  // const { data: loggedInUserData } = useProfile();

  function handleAddressChange(propName, value) {
    if (propName === 'phone') setPhone(value);
    if (propName === 'streetAddress') setStreetAddress(value);
    if (propName === 'postalCode') setPostalCode(value);
    if (propName === 'city') setCity(value);
    if (propName === 'country') setCountry(value);
  }

  return (
    <div className="md:flex gap-4">
      <div className=''>
        <div className="p-2 rounded-lg relative max-w-full md:max-w-[300px]">
          {/* <EditableImage link={image} setLink={setImage} /> */}
        </div>
      </div>
      <form
        className="grow"
        onSubmit={ev =>
          onSave(ev, {
            name: userName,email: userEmail ,image, phone, admin,
            streetAddress, city, country, postalCode,
          })
        }
      >
        <label className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          placeholder="First and last name"
          value={userName}
          onChange={ev => setUserName(ev.target.value)}
          className="block w-full mt-1 mb-2 rounded-xl border p-2 border-gray-300 bg-gray-100"
        />
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          disabled={true}
          value={userEmail}
          onChange={ev => setUserEmail(ev.target.value)}
          placeholder={'email'}
          className="block w-full mt-1 mb-2 rounded-xl border p-2 border-gray-300 bg-gray-300 cursor-not-allowed text-gray-500"
        />
        <AddressInputs
          addressProps={{ phone, streetAddress, postalCode, city, country }}
          setAddressProp={handleAddressChange}
        />
        {/* {loggedInUserData.admin && (
          <div>
            <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="adminCb">
              <input
                id="adminCb"
                type="checkbox"
                className="form-checkbox"
                checked={admin}
                onChange={ev => setAdmin(ev.target.checked)}
              />
              <span className="ml-2">Admin</span>
            </label>
          </div>
        )} */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 w-full mt-5">
          Save
        </button>
      </form>
    </div>
  );
}
