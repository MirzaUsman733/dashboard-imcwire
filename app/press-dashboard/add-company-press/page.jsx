"use client";
import Modal from "../../components/Modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import TawkTo from "../../components/TawkTo";

const FirstComponent = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(true);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyInfo, setNewCompanyInfo] = useState("");
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);
  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleOpenModal = () => {
    setIsNewCompanyModalOpen(true);
  };

  const handleSubmitNewCompany = (companyDetails) => {};

  const handleNewCompanySubmit = () => {
    setNewCompanyName("");
    setNewCompanyInfo("");
    setIsNewCompanyModalOpen(true);
  };

  return (
    <div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grids-cols-4 gap-5"></div>
      <Modal
        isOpen={isNewCompanyModalOpen}
        // onClose={handleCloseModal}
        onSubmit={handleSubmitNewCompany}
      />
    </div>
  );
};


const UploadForm = () => {
  const { data: session, status: sessionStatus } = useSession();
  // const [loading, setLoading] = useState(true); 
  // if (loading) {
  //   return (
  //     <div className="h-[80vh] flex justify-center items-center w-full">
  //       <InfinitySpin
  //         visible={true}
  //         width="200"
  //         color="#7E22CE"
  //         ariaLabel="infinity-spin-loading"
  //       />
  //     </div>
  //   );
  // }
  if (session && sessionStatus === "authenticated") {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white border border-1 shadow-lg rounded-lg">
      {<FirstComponent />}
    </div>
  );
} else {
  return (
    <div className="h-[100vh] flex justify-center items-center w-full">
      <TawkTo/>
      {/* <RotatingTriangles
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="rotating-triangles-loading"
        wrapperStyle={{}}
        wrapperClass="m-auto"
      /> */}
    </div>
  );
}
};

export default UploadForm;
